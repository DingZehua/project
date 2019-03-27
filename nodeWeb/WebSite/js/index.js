define(function(require) {

  var React   = require('react');
  var jsx     = require('lib/jsxquasi');
    console.log(jsx)
  var EchoComponent = React.createClass({
      getInitialState: function() {
          return { value: '' };
      },

      handleChange: function() {
          this.setState({ value: this.refs.input.getDOMNode().value });
      },

      render: function() {
          return jsx`
              <div>
                  <input 
                      ref='input' 
                      onChange='${this.handleChange}' 
                      defaultValue='${this.state.value}' />
                  ${this.state.value}
              </div>
          `;
      }
  })
  return function() {
      var comp = jsx`<${EchoComponent} />`;
      React.renderComponent(comp, document.body);
  };
});