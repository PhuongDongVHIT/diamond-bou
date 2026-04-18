const url = 'https://www.facebook.com/plugins/like.php?href=https://youtube.com&layout=button_count';

fetch(url)
  .then(res => res.text())
  .then(text => {
    // try to find the hidden span that contains the count "pluginCountTextConnected"
    const countIndex = text.indexOf('pluginCountTextConnected');
    if (countIndex > -1) {
      console.log('Context:', text.substring(countIndex - 50, countIndex + 50));
    }
    
    // try global match for 12K, 3.4M, or numbers
    const matches = text.match(/<span class="_5n6h[^>]*>([^<]+)<\/span>/g);
    console.log('Matches:', matches);

    // print it out entirely to file for inspection
    require('fs').writeFileSync('fb-like.html', text);
  })
  .catch(console.error);
