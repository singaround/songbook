import htm from "https://unpkg.com/htm?module";
import format from "https://unpkg.com/date-fns@2.0.0-alpha.2/esm/format/index.js?module";

const html = htm.bind(h);

let options = {
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
};

var md = window.markdownit(options);

function renderHtml(unrendered) {
  return h("div", {
    dangerouslySetInnerHTML: {
      __html: md.render(unrendered)
    }
  })
}

// Preview component for a Post
const Song = createClass({
  render() {
    const entry = this.props.entry;

    return html`
      <main>
        <article class="content">
          <h1>${entry.getIn(["data", "title"], null)}</h1>
          <p>
            <small>
              <time
                >${
                  format(
                    entry.getIn(["data", "date"], new Date()),
                    "DD MMM, YYYY"
                  )
                }</time
              >
              ${" by Author"}
            </small>
          </p>
          <p>
          ${renderHtml(entry.getIn(["data", "description"], ""))}
          </p>
          ${renderHtml(entry.getIn(["data", "body"], ""))}
          <p>
            ${
              entry.getIn(["data", "tags"], []).map(
                tag =>
                  html`
                    <a href="#" rel="tag">${tag}</a>
                  `
              )
            }
          </p>
        </article>
      </main>
    `;
  }
});

export default Song;
