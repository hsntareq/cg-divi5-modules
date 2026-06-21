import React, { ReactElement } from 'react';
import { ModuleContainer } from '@divi/module';
import { CGDriveVideoEditProps } from './types';
import { ModuleStyles } from './styles';
import { ModuleScriptData } from './module-script-data';
import { moduleClassnames } from './module-classnames';

export const getGoogleDriveFileId = (url: string): string | null => {
  if (!url) return null;
  // Match standard share links: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const dLinkRegex = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(dLinkRegex);
  if (match && match[1]) {
    return match[1];
  }
  // Match direct links or query param id: https://drive.google.com/open?id=FILE_ID
  const idRegex = /[?&]id=([a-zA-Z0-9_-]+)/;
  const idMatch = url.match(idRegex);
  if (idMatch && idMatch[1]) {
    return idMatch[1];
  }
  return null;
};

export const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

interface CGDriveVideoPlayerProps {
  videoSourceType: string;
  fileId: string | null;
  renderMode: string;
  youtubeId: string | null;
  youtubeControls: string;
  videoCode: string;
}

const CGDriveVideoPlayer = React.memo((props: CGDriveVideoPlayerProps): ReactElement | null => {
  const {
    videoSourceType,
    fileId,
    renderMode,
    youtubeId,
    youtubeControls,
    videoCode,
  } = props;

  if (videoSourceType === 'url') {
    if (!fileId) {
      return (
        <div className="cg_drive_video__placeholder">
          Please enter a valid Google Drive URL (e.g., https://drive.google.com/file/d/FILE_ID/view)
        </div>
      );
    } else if (renderMode === 'video_tag') {
      const streamUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      return (
        <video
          className="cg_drive_video__element"
          src={streamUrl}
          autoPlay
          loop
          muted
          playsInline
        />
      );
    } else {
      const iframeUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      return (
        <iframe
          className="cg_drive_video__iframe"
          src={iframeUrl}
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      );
    }
  } else if (videoSourceType === 'youtube') {
    if (!youtubeId) {
      return (
        <div className="cg_drive_video__placeholder">
          Please enter a valid YouTube or YouTube Shorts URL
        </div>
      );
    } else {
      const showControls = youtubeControls === 'on' ? '1' : '0';
      const iframeUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&mute=1&controls=${showControls}&playsinline=1&modestbranding=1&rel=0&enablejsapi=1`;
      return (
        <iframe
          className="cg_drive_video__iframe"
          src={iframeUrl}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      );
    }
  } else {
    if (!videoCode) {
      return (
        <div className="cg_drive_video__placeholder">
          Please enter your iframe or video embed code
        </div>
      );
    } else {
      return (
        <div
          className="cg_drive_video__embed-wrapper"
          dangerouslySetInnerHTML={{ __html: videoCode }}
        />
      );
    }
  }
});

export const CGDriveVideoEdit = (props: CGDriveVideoEditProps): ReactElement => {
  const {
    attrs,
    elements,
    id,
    name,
  } = props;

  const videoSourceType = attrs.videoSourceType?.innerContent?.desktop?.value || 'url';
  const videoUrl = attrs.videoUrl?.innerContent?.desktop?.value || '';
  const youtubeUrl = attrs.youtubeUrl?.innerContent?.desktop?.value || '';
  const youtubeControls = attrs.youtubeControls?.innerContent?.desktop?.value || 'off';
  const seamlessMode = attrs.seamlessMode?.innerContent?.desktop?.value || 'on';
  const renderMode = attrs.renderMode?.innerContent?.desktop?.value || 'video_tag';
  const videoCode = attrs.videoCode?.innerContent?.desktop?.value || '';
  const dimensionType = attrs.dimensionType?.innerContent?.desktop?.value || 'aspect_ratio';
  const aspectRatio = attrs.aspectRatio?.innerContent?.desktop?.value || '16/9';
  const customAspectRatio = attrs.customAspectRatio?.innerContent?.desktop?.value || '16/9';
  const customWidth = attrs.customWidth?.innerContent?.desktop?.value || '100%';
  const customHeight = attrs.customHeight?.innerContent?.desktop?.value || '450px';

  // Parse IDs from URLs
  const fileId = getGoogleDriveFileId(videoUrl);
  const youtubeId = getYouTubeVideoId(youtubeUrl);

  // Build the dimension styles dynamically
  const containerStyle = {} as React.CSSProperties;
  if (dimensionType === 'aspect_ratio') {
    const ratio = aspectRatio === 'custom' ? customAspectRatio : aspectRatio;
    containerStyle.aspectRatio = ratio || '16/9';
    containerStyle.width = '100%';
    containerStyle.height = 'auto';
  } else {
    containerStyle.width = customWidth || '100%';
    containerStyle.height = customHeight || '450px';
  }

  // Determine container classes
  const containerClasses = [
    'cg_drive_video__container',
    seamlessMode === 'on' ? 'cg_drive_video__container--seamless' : '',
  ].filter(Boolean).join(' ');

  return (
    <ModuleContainer
      attrs={attrs}
      elements={elements}
      id={id}
      name={name}
      stylesComponent={ModuleStyles}
      scriptDataComponent={ModuleScriptData}
      classnamesFunction={moduleClassnames}
      className="cg_drive_video"
    >
      {elements.styleComponents({
        attrName: 'module',
      })}

      <div className={containerClasses} style={containerStyle}>
        <CGDriveVideoPlayer
          videoSourceType={videoSourceType}
          fileId={fileId}
          renderMode={renderMode}
          youtubeId={youtubeId}
          youtubeControls={youtubeControls}
          videoCode={videoCode}
        />
      </div>
    </ModuleContainer>
  );
};
