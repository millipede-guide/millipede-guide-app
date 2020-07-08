import Lightbox from 'react-image-lightbox';
import Link from '@material-ui/core/Link';
import photoIndex from '../public/photos/index.json';

export function init(photos) {
    return {
        photos,
        visible: false,
        index: 0,
    };
}

export function reducer(state, action) {
    switch (action.do) {
        case 'show':
            return {
                ...state,
                photos: action.photos || state.photos || [],
                visible: true,
                index: action.index || 0,
            };
        case 'hide':
            return {
                ...state,
                visible: false,
            };
        case 'next':
            return {
                ...state,
                index: (state.index + 1) % state.photos.length,
            };
        case 'prev':
            return {
                ...state,
                index: (state.index + state.photos.length - 1) % state.photos.length,
            };
        default:
            throw new Error(action.do);
    }
}

export default ({ state, action }) => {
    // const sm = i => `/photos/sm/${photoIndex[state.photos[i].src].hash}.jpg`;

    const lg = (i) =>
        `${process.env.assetPrefix}/photos/lg/${photoIndex[state.photos[i].src].hash}.jpg`;

    const main = (fn) => fn(state.index);

    const next = (fn) =>
        state.photos.length > 1 && state.index + 1 < state.photos.length
            ? fn((state.index + 1) % state.photos.length)
            : null;

    const prev = (fn) =>
        state.photos.length > 1 && state.index > 0
            ? fn((state.index + state.photos.length - 1) % state.photos.length)
            : null;

    const caption = (i) => {
        const { src, href, attr, license, year } = state.photos[i];
        return (
            <Link href={href}>
                Photo by {attr} [{license}] ({year || photoIndex[src].year})
            </Link>
        );
    };

    return (
        <>
            {state.visible && (
                <Lightbox
                    mainSrc={main(lg)}
                    nextSrc={next(lg)}
                    prevSrc={prev(lg)}
                    /* Thumbnails are disabled due to screen flicker when lg size is loaded: */
                    /* mainSrcThumbnail={main(sm)} */
                    /* nextSrcThumbnail={next(sm)} */
                    /* prevSrcThumbnail={prev(sm)} */
                    imageCaption={caption(state.index)}
                    onCloseRequest={() =>
                        action({
                            do: 'hide',
                        })
                    }
                    onMovePrevRequest={() =>
                        action({
                            do: 'prev',
                        })
                    }
                    onMoveNextRequest={() =>
                        action({
                            do: 'next',
                        })
                    }
                    imagePadding={20}
                    reactModalStyle={{
                        overlay: {
                            zIndex: 10000,
                        },
                    }}
                    animationDisabled
                    animationDuration={0}
                />
            )}
        </>
    );
};
