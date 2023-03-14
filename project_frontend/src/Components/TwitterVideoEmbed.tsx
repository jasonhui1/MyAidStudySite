//https://github.com/saurabhnemade/react-twitter-embed/blob/master/src/components/TwitterVideoEmbed.tsx
//Able to add className to new div created

import React, {useRef, useState,useEffect} from 'react';

const methodName = 'createVideo';
const twitterWidgetJs = 'https://platform.twitter.com/widgets.js'

declare global {
  interface Window {
    twttr: any;
  }
}

export interface TwitterVideoEmbedProps {
  /**
   * Id of video tweet.
   */
  id: string;
  /**
   * Placeholder while tweet is loading
   */
  placeholder?: string | React.ReactNode;
  /**
   * Function to execute after load, return html element
   */
  onLoad?: (element: any) => void;
  className?: string;
}


const TwitterVideoEmbed = (props: TwitterVideoEmbedProps):any => {
  const ref = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isComponentMounted = true;
    const script = require('scriptjs');
    script(twitterWidgetJs, 'twitter-embed', () => {
      if (isComponentMounted) {


        window.twttr.widgets[methodName](props.id, ref?.current).then(
          (element: any) => {
            setLoading(false);
            if (props.onLoad) {
              props.onLoad(element);
            }
          }
        );
      }
    });

    // cleaning up
    return () => {
      isComponentMounted = false;
    };
  }, []);

  return (
    <React.Fragment>
      {loading && <React.Fragment>{props.placeholder}</React.Fragment>}
      <div ref={ref} className={props.className} />
    </React.Fragment>
  );
};

export default TwitterVideoEmbed;