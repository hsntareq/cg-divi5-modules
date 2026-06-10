import React, { ReactElement, useEffect, useState } from 'react';
import { ChildModulesContainer, ModuleContainer } from '@divi/module';
import { useSelect } from '@wordpress/data';
import { createPortal } from 'react-dom';
import { CarouselEditProps } from './types';
import { ModuleStyles } from './styles';
import { ModuleScriptData } from './module-script-data';
import { moduleClassnames } from './module-classnames';

interface BulkAddPortalProps {
  parentId: string;
}

const BulkAddPortal = ({ parentId }: BulkAddPortalProps) => {
  const isSelected = useSelect((select: any) => {
    return select('core/block-editor').getSelectedBlockClientId() === parentId;
  }, [parentId]);

  const [portalTarget, setPortalTarget] = useState<Element | null>(null);

  useEffect(() => {
    if (!isSelected) {
      setPortalTarget(null);
      return;
    }

    // Interval to look for the container in settings modal
    const interval = setInterval(() => {
      const target = document.querySelector('.et-vb-child-module-draggable-list-items-wrap');
      if (target) {
        setPortalTarget(target);
        clearInterval(interval);
      }
    }, 200);

    return () => {
      clearInterval(interval);
    };
  }, [isSelected]);

  if (!portalTarget || !isSelected) {
    return null;
  }

  const handleBulkAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const wpGlobal = (window as any).wp;
    if (!wpGlobal || !wpGlobal.media) {
      alert('WordPress Media Library is not loaded.');
      return;
    }

    const frame = wpGlobal.media({
      title: 'Bulk Add Slide Images',
      button: {
        text: 'Add to Carousel'
      },
      multiple: true,
      library: {
        type: 'image'
      }
    });

    frame.on('select', () => {
      const selection = frame.state().get('selection').toJSON();
      if (!selection || selection.length === 0) return;

      const blocks = selection.map((media: any) => {
        const titleText = media.title || '';
        return wpGlobal.blocks.createBlock('cg/carousel-item', {
          image: {
            innerContent: {
              desktop: {
                value: {
                  src: media.url || '',
                  id: media.id,
                  alt: media.alt || '',
                  titleText: titleText
                }
              }
            }
          },
          title: {
            innerContent: {
              desktop: {
                value: titleText
              }
            }
          }
        });
      });

      wpGlobal.data.dispatch('core/block-editor').insertBlocks(blocks, undefined, parentId);
    });

    frame.open();
  };

  return createPortal(
    <div className="cg-bulk-add-container" style={{ marginTop: '12px', padding: '0 4px' }}>
      <button
        onClick={handleBulkAdd}
        type="button"
        className="et-core-button"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          width: '100%',
          padding: '10px 16px',
          background: '#0073aa', // Divi blue accent
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'background 0.2s, transform 0.1s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = '#005983')}
        onMouseOut={(e) => (e.currentTarget.style.background = '#0073aa')}
      >
        <span style={{ fontSize: '15px', fontWeight: 'bold', lineHeight: 1 }}>+</span> Bulk Add Images
      </button>
    </div>,
    portalTarget
  );
};

export const CarouselEdit = (props: CarouselEditProps): ReactElement => {
  const {
    attrs,
    elements,
    id,
    name,
    childrenIds,
  } = props;

  const slidesToShowAttr = attrs.slidesToShow?.innerContent?.desktop?.value || attrs.slidesToShow?.desktop?.value || '4';
  const slidesToShow = String(slidesToShowAttr).replace(/[^0-9]/g, '') || '4';

  const innerStyle = {
    '--slides-to-show': slidesToShow,
  } as React.CSSProperties;

  return (
    <ModuleContainer
      attrs={attrs}
      elements={elements}
      id={id}
      name={name}
      stylesComponent={ModuleStyles}
      scriptDataComponent={ModuleScriptData}
      classnamesFunction={moduleClassnames}
      className="cg_carousel_parent"
    >
      {elements.styleComponents({
        attrName: 'module',
      })}
      
      <BulkAddPortal parentId={id} />
      
      <div className="cg_carousel__inner" style={innerStyle}>
        <div className="cg_carousel__track-wrapper">
          <div className="cg_carousel__track">
            <ChildModulesContainer ids={childrenIds} />
          </div>
        </div>
      </div>
    </ModuleContainer>
  );
};
