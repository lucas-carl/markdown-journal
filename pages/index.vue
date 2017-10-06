<template>
  <main>
    <section class="page-editor">
      <div class="editor-head">
        <a class="icon-link link-back" href="#">
          <i class="material-icons">keyboard_arrow_left</i>
        </a>
        <a class="icon-link" href="#" @click.prevent="$refs.editor.addStrong">
          <i class="material-icons">format_bold</i>
        </a>
        <a class="icon-link" href="#" @click.prevent="$refs.editor.addItalic">
          <i class="material-icons">format_italic</i>
        </a>
        <a class="icon-link" href="#" @click.prevent="$refs.editor.addCode">
          <i class="material-icons">code</i>
        </a>
        <a class="icon-link" href="#" @click.prevent="$refs.editor.addLink">
          <i class="material-icons">link</i>
        </a>
      </div>

      <text-editor @markdown="text => updateText(text)" ref="editor"></text-editor>
    </section>

    <section class="page-content" v-html="text"></section>
  </main>
</template>

<script>
  import TextEditor from '~/components/TextEditor.vue'

  export default {

    data() {
      return {
        text: ''
      }
    },

    components: {
      TextEditor
    },

    methods: {
      updateText(val) {
        this.text = val
      }
    }

  }
</script>
