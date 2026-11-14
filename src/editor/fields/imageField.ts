import { BYTES_PER_MB, MAX_UPLOAD_NOTE_BYTES } from '../constants';
import { assetUrl } from '../document/assetUrl';
import type { EditorState } from '../EditorState';
import { changed } from '../shell/changed';
import { notify } from '../shell/notify';
import { h } from '../util/h';
import { attrField } from './attrField';
import { nextFieldId } from './nextFieldId';
import { refreshKnownImages } from './refreshKnownImages';
import { registerField } from './registerField';
import { stageFile } from './stageFile';
import { uniqueImagePath } from './uniqueImagePath';

/** Fields for an image: a thumbnail, an upload, its path and alt text. */
export function imageField(
    state: EditorState,
    label: string,
    img: Element,
): HTMLElement {
    const thumbImg = h('img', { alt: '' });
    const thumbEmpty = h('span', {}, 'No image');
    const showThumb = (): void => {
        const src = img.getAttribute('src');
        thumbImg.hidden = !src;
        thumbEmpty.hidden = Boolean(src);
        if (src) thumbImg.src = assetUrl(state, src);
    };
    showThumb();

    const pathField = attrField(state, 'Image path', img, 'src', {
        list: 'known-images',
        placeholder: 'img/my-image.jpg',
    });
    const pathInput = pathField.querySelector('input');
    pathInput?.addEventListener('input', showThumb);

    const fileId = nextFieldId(state);
    const fileInput = h('input', {
        type: 'file',
        id: fileId,
        accept: 'image/*',
    });
    const addFile = async (): Promise<void> => {
        const file = fileInput.files?.[0];
        if (!file) return;
        const path = uniqueImagePath(state.knownImages, file.name);
        await stageFile(state, file, path);
        state.knownImages.push(path);
        refreshKnownImages(state);
        img.setAttribute('src', path);
        if (pathInput) pathInput.value = path;
        showThumb();
        changed(state);
        const megabytes = (file.size / BYTES_PER_MB).toFixed(1);
        notify(
            state,
            file.size > MAX_UPLOAD_NOTE_BYTES
                ? `${path} added, but it is ${megabytes} MB. ` +
                      'Under 1 MB keeps your site fast.'
                : `${path} added. It uploads when you publish.`,
        );
    };
    fileInput.addEventListener('change', () => {
        void addFile();
    });

    // Clicking the image on the page goes straight to the upload.
    const upload = h(
        'div',
        { class: 'upload' },
        fileInput,
        h('label', { for: fileId, class: 'btn' }, 'Upload image'),
    );
    registerField(state, img, upload);
    return h(
        'div',
        {},
        h('p', { class: 'field-label' }, label),
        h(
            'div',
            { class: 'image-field' },
            h('div', { class: 'thumb' }, thumbImg, thumbEmpty),
            h(
                'div',
                {},
                upload,
                pathField,
                attrField(state, 'Alt text', img, 'alt', {
                    multiline: true,
                    hint:
                        'Describe the image for people using a screen ' +
                        'reader.',
                }),
            ),
        ),
    );
}
