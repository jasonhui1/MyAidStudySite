//https://github.com/saurabhnemade/react-twitter-embed/blob/master/src/components/TwitterVideoEmbed.tsx
//Able to add className to new div created

import React, {useRef, useState,useEffect} from 'react';

const methodName = 'createVideo';
const twitterWidgetJs = 'https://platform.twitter.com/widgets.js'

const TwitterVideoEmbed = (props) => {
  const ref = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isComponentMounted = true;
    const script = require('scriptjs');
    script(twitterWidgetJs, 'twitter-embed', () => {
      if (isComponentMounted) {


        window.twttr.widgets[methodName](props.id, ref?.current).then(
          (element) => {
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