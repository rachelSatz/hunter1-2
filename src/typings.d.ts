/* SystemJS module definition */
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

declare var module: NodeModule;
interface NodeModule {
  id: string;
}
declare module '@ckeditor/ckeditor5-build-classic' {

  // ClassicEditor
  //   .create( document.querySelector( '#editor' ), {
  //     fontFamily: {
  //       options: [
  //         'default',
  //         'Ubuntu, Arial, sans-serif',
  //         'Ubuntu Mono, Courier New, Courier, monospace'
  //       ]
  //     },
  //     toolbar: [
  //       'heading', 'bulletedList', 'numberedList', 'fontFamily', 'undo', 'redo'
  //     ]
  //   } )
  //   .then()
  //   .catch(err => alert(err));
}
