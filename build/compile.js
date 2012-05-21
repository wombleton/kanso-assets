// Generated by CoffeeScript 1.3.1
(function() {
  var Snockets, crypto, _;

  _ = require('underscore');

  Snockets = require('snockets');

  crypto = require('crypto');

  module.exports = function(root, path, settings, doc, callback) {
    var assets, attachments, config, minify, names, output, prefix, snockets;
    snockets = new Snockets();
    config = _.defaults(settings['kanso-assets'] || {}, {
      assets: 'assets',
      minify: false,
      prefix: 'js',
      output: 'static/js'
    });
    assets = config.assets, minify = config.minify, output = config.output, prefix = config.prefix;
    attachments = doc._attachments;
    names = _.filter(_.keys(attachments), function(name) {
      return /\.html$/.test(name);
    });
    return _.each(names, function(name, index) {
      var attachment, comment, file, finished, html, match, quote, re, _results;
      attachment = attachments[name];
      html = new Buffer(attachment.data, 'base64').toString();
      re = /<!--\s*js\((['"])(.+?)\1\)\s*-->/g;
      finished = false;
      _results = [];
      while (!finished) {
        match = re.exec(html);
        if (match) {
          comment = match[0], quote = match[1], file = match[2];
          _results.push(snockets.getConcatenation("" + assets + "/" + file, {
            minify: minify,
            async: false
          }, function(err, js) {
            var filename;
            if (err) {
              throw err;
            } else {
              filename = "" + (file.replace(/\.(coffee|js)/, '')) + "-" + (crypto.createHash('md5').update(js).digest('hex').substring(0, 12)) + ".js";
              attachments["" + output + "/" + filename] = {
                content_type: 'text/javascript',
                data: new Buffer(js).toString('base64')
              };
              html = html.replace(/<!--\s*js\((['"])(.+?)\1\)\s*-->/, "<script src=\"" + prefix + "/" + filename + "\"></script>");
              attachments[name] = {
                content_type: 'text/html',
                data: new Buffer(html).toString('base64')
              };
              return console.log("Added " + output + "/" + filename + " with a path of " + prefix + "/" + filename);
            }
          }));
        } else {
          if (index === names.length - 1) {
            callback(null, doc);
          }
          _results.push(finished = true);
        }
      }
      return _results;
    });
  };

}).call(this);
