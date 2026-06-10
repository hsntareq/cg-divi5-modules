import React, { ReactElement } from 'react';
import { ModuleContainer } from '@divi/module';
import { TextMarqueeEditProps } from './types';
import { ModuleStyles } from './styles';
import { ModuleScriptData } from './module-script-data';
import { moduleClassnames } from './module-classnames';

export const TextMarqueeEdit = (props: TextMarqueeEditProps): ReactElement => {
  const {
    attrs,
    elements,
    id,
    name,
  } = props;

  const speed = attrs.speed?.innerContent?.desktop?.value || '15';
  const direction = attrs.direction?.innerContent?.desktop?.value || 'left';
  const pauseOnHover = attrs.pauseOnHover?.innerContent?.desktop?.value || 'on';
  const textValue = attrs.text?.innerContent?.desktop?.value || 'This is a seamless text marquee slider! • ';

  const style = {
    '--marquee-duration': `${speed}s`,
    '--marquee-direction': direction === 'left' ? 'normal' : 'reverse',
    '--marquee-pause-state': pauseOnHover === 'on' ? 'paused' : 'running',
  } as React.CSSProperties;

  // We repeat the text to fill standard screen widths
  const repeatCount = 6;

  return (
    <ModuleContainer
      attrs={attrs}
      elements={elements}
      id={id}
      name={name}
      stylesComponent={ModuleStyles}
      scriptDataComponent={ModuleScriptData}
      classnamesFunction={moduleClassnames}
      className="cg_text_marquee"
    >
      {elements.styleComponents({
        attrName: 'module',
      })}

      <div className="cg_text_marquee__inner" style={style}>
        <div className="cg_text_marquee__track">
          <div className="cg_text_marquee__group cg_text_marquee__group--a">
            {/* The first element is the inline-editable element */}
            <span className="cg_text_marquee__item">
              {elements.render({
                attrName: 'text',
              })}
            </span>
            {/* The rest are simple static clones */}
            {[...Array(repeatCount - 1)].map((_, i) => (
              <span key={i} className="cg_text_marquee__item cg_text_marquee__content">
                {textValue}
              </span>
            ))}
          </div>
          <div className="cg_text_marquee__group cg_text_marquee__group--b">
            {[...Array(repeatCount)].map((_, i) => (
              <span key={i} className="cg_text_marquee__item cg_text_marquee__content">
                {textValue}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ModuleContainer>
  );
};
