const DefaultSection = {
  name: "default-section",
  props: {
    /** @type ResultSection */
    section: { type: Object, required: true },
    currentIndex: { type: [Number, String], required: false, default: Infinity },
    renderSuggestion: { type: Function, required: false },
    normalizeItemFunction: { type: Function, required: true }
  },
  data: function() {
    return {
      _currentIndex: null
    }
  },
  computed: {
    list: function() {
      let { limit, data } = this.section;
      if (data.length < limit) {
        limit = data.length;
      }
      return data.slice(0, limit);
    },
    className: function() {
      return `autosuggest__result-title -${this.section.name}`;
    },
    wrapperClassName: function() {
      return `autosuggest__result -${this.section.name}`;
    }
  },
  methods: {
    getItemIndex(i) {
      return this.section.start_index + i;
    },
    getItemByIndex(i) {
      return this.section.data[i];
    },
    onMouseEnter(event) {
      const idx = event.currentTarget.getAttribute("data-suggestion-index")
      this._currentIndex = idx
      this.$emit('updateCurrentIndex', idx)
    },
    onMouseLeave() {
      this.$emit('updateCurrentIndex', null)
    },
    genTitle(){
      const beforeSection = this.$scopedSlots[`before-section-${this.section.name}`]
      const beforeClassName = `autosuggest__results-before autosuggest__results-before--${this.section.name}`

      const before = beforeSection && beforeSection({
        section: this.section,
        className: beforeClassName
      })

      if (before[0] && !this.section.label) {
        return before[0]
      } else if(this.section.label) {
        return this.$createElement('h3',{ class: beforeClassName }, this.section.label)
      } 
    },
    genFooter() {
      if(this.section.footer) {
        return this.$createElement('a', { 
          class: `autosuggest__result-footer -${this.section.name}`,
          attrs: {
            href: this.section.footer.link
          },
        }, 
        this.section.footer.label)
      }
    },

    genResult() {
      const slots = {
        afterSectionDefault: this.$scopedSlots[`after-section`],
        afterSectionNamed: this.$scopedSlots[`after-section-${this.section.name}`]
      }

      return this.$createElement('div', 
      {class: 'autosuggest__result-wrapper'},
      [
        this.genTitle(),
        this.list.map((val, key) => {
          let item = this.normalizeItemFunction(this.section.name, this.section.type, this.section.label, val)
          return this.$createElement(
            "div",
            {
              attrs: {
                role: "option",
                "data-suggestion-index": this.getItemIndex(key),
                "data-section-name": this.section.name,
                id: "autosuggest__result-item--" + this.getItemIndex(key)
              },
              key: this.getItemIndex(key),
              class: {
                "autosuggest__result-item--highlighted":
                  this.getItemIndex(key) == this.currentIndex,
                "autosuggest__result-item": true
              },
              on: {
                mouseenter: this.onMouseEnter,
                mouseleave: this.onMouseLeave
              }
            },
            [this.renderSuggestion ? this.renderSuggestion(item) 
              : this.$scopedSlots.default && this.$scopedSlots.default({
                key: key,
                suggestion: item
            })]
          );
        }),
        slots.afterSectionDefault && slots.afterSectionDefault({ 
          section: this.section,
          className: `autosuggest__results-after autosuggest__results-after--${this.section.name}`
        }),
        slots.afterSectionNamed && slots.afterSectionNamed({ 
          section: this.section,
          className: `autosuggest__results_after autosuggest__results-after--${this.section.name}`
        })
      ])
    }
  },
  // eslint-disable-next-line no-unused-vars
  render(h) {
    return h(
      "div",
      {
        class: this.wrapperClassName,
        attrs: { role: "listbox", "aria-labelledby": "autosuggest" }
      },
      [
        this.genResult(),
        this.genFooter()
      ]
    );
  }
};

export default DefaultSection;
