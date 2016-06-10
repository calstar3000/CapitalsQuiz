var utilities = (function() {
    // Returns a random integer between min (included) and max (excluded)
    function _getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function _loadFile(filePath, mimeType, callback) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType(mimeType);
        xobj.open('GET', filePath, true);

        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200")
                callback(xobj);
        };

        xobj.send(null);
    }

    function _addScriptAsync(src, callback) {
        var script = document.createElement('script');
        script.src = src;
        script.async = false;
         if (callback) {
             script.addEventListener('load', function (e) {
                 callback(null, e);
             }, false);
         }
        document.head.appendChild(script);
    }

    return {
        getRandomInt: function(min, max) {
            return _getRandomInt(min, max);
        },
        loadFile: function(filePath, mimeType, callback) {
            _loadFile(filePath, mimeType, callback);
        },
        addScriptAsync: function(src, callback) {
            _addScriptAsync(src, callback);
        }
    };
})();
