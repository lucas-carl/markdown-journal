<template>
  <textarea class="text-editor" :value="inputValue"
    @input="getInput($event.target.value)"
    @keydown.tab.prevent="addTab"
    placeholder="Write something"
    ref="editor">
  </textarea>
</template>

<script>
  import marked from 'marked'

  export default {

    data() {
      return {
        inputText: ''
      }
    },

    props: {
      value: {
        type: String,
        default: ''
      }
    },

    computed: {
      inputValue() {
        return this.inputText || this.value
      },
      compiledMarkDown() {
        return marked(this.inputValue, { sanitize: true })
      }
    },

    methods: {
      getInput(value) {
        this.inputText = value
        this.updateText()
      },
      updateText(value) {
        if (value) {
          this.inputText += value
        }

        this.$refs.editor.value = this.inputText
        this.$refs.editor.focus()

        this.$emit('markdown', this.compiledMarkDown)
      },
      addTab() {
        this.updateText('\n  ')
      },
      addStrong() {
        let cursor
        let selection = this.getSelection()
        let content = this.$refs.editor.value
        let chunk = selection.text

        if (selection.length === 0) {
          chunk = 'bold'
        }

        if (content.substr(selection.start - 2, 2) === '**' && content.substr(selection.end, 2) === '**') {
          this.setSelection(selection.start - 2, selection.end + 2)
          this.replaceSelection(chunk)
          cursor = selection.start - 2
        } else {
          this.replaceSelection('**' + chunk + '**')
          cursor = selection.start + 2
        }

        this.setSelection(cursor, cursor + chunk.length)
        this.updateText()
      },
      addItalic() {
        let cursor
        let selection = this.getSelection()
        let content = this.$refs.editor.value
        let chunk = selection.text

        if (selection.length === 0) {
          chunk = 'italic'
        }

        if (content.substr(selection.start - 1, 1) === '_' && content.substr(selection.end, 1) === '_') {
          this.setSelection(selection.start - 1, selection.end + 1)
          this.replaceSelection(chunk)
          cursor = selection.start - 1
        } else {
          this.replaceSelection('_' + chunk + '_')
          cursor = selection.start + 1
        }

        this.setSelection(cursor, cursor + chunk.length)
        this.updateText()
      },
      addLink() {
        let cursor, link
        let selection = this.getSelection()
        let chunk = selection.text

        link = prompt('', 'http://')

        if (selection.length === 0) {
          chunk = link
        }

        let urlRegex = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi) // eslint-disable-line no-useless-escape

        if (link && link !== 'http://' && urlRegex.test(link)) {
          let div = document.createElement('div')
          div.appendChild(document.createTextNode(link))
          let sanitized = div.innerHTML

          this.replaceSelection('[' + chunk + '](' + sanitized + ')')
          cursor = selection.start + 1

          this.setSelection(cursor, cursor + chunk.length)
        }

        this.updateText()
      },
      addCode() {
        let cursor
        let selection = this.getSelection()
        let content = this.$refs.editor.value
        let chunk = selection.text

        if (selection.length === 0) {
          chunk = 'console.log(\'Hello, world!\')'
        }

        if (content.substr(selection.start - 4, 4) === '```\n' && content.substr(selection.end, 4) === '\n```') {
          this.setSelection(selection.start - 4, selection.end + 4)
          this.replaceSelection(chunk)
          cursor = selection.start - 4
        } else if (content.substr(selection.start - 1, 1) === '`' && content.substr(selection.end, 1) === '`') {
          this.setSelection(selection.start - 1, selection.end + 1)
          this.replaceSelection(chunk)
        } else if (content.indexOf('\n') > 1) {
          this.replaceSelection('```\n' + chunk + '\n```')
          cursor = selection.start + 4
        } else {
          this.replaceSelection('`' + chunk + '`')
          cursor = selection.start + 1
        }

        this.setSelection(cursor, cursor + chunk.length)
        this.updateText()
      },
      getSelection() {
        let e = this.$refs.editor

        let l = e.selectionEnd - e.selectionStart

        return {
          start: e.selectionStart,
          end: e.selectionEnd,
          length: l,
          text: e.value.substr(e.selectionStart, l)
        }
      },
      setSelection(start, end) {
        let e = this.$refs.editor

        e.selectionStart = start
        e.selectionEnd = end
      },
      replaceSelection(text) {
        let e = this.$refs.editor

        this.inputText = e.value.substr(0, e.selectionStart) + text + e.value.substr(e.selectionEnd, e.value.length)

        e.selectionStart = e.value.length
      }
    }

  }
</script>
