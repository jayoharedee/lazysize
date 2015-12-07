var lazySize = (function() {
    var _ = {
        images: [],

        lazySizes: {},

        resizeTimeout: null,

        givenWidths: [],
        
        imgTags: document.getElementsByClassName('lazysize'),

        getImageSizes: function() {
            var images = _.imgTags; 

            for (var i = images.length - 1; i >= 0; i--) {
                var image = images[i];
                _.images.push(image);
                var srcSet = image.getAttribute('src-set');
                srcSet = srcSet.split(',');

                for (var j = srcSet.length - 1; j >= 0; j--) {
                    var src = srcSet[j].split(' '),
                        width = src[1],
                        imgSrc = src[0];

                    if (_.givenWidths.indexOf(width) < 0) {
                        _.givenWidths.push(width);
                    }

                    if (!_.lazySizes[width]) {
                        _.lazySizes[width] = [imgSrc];
                        continue;
                    }

                    _.lazySizes[width].push(imgSrc);
                }
            }
        },

        findRightSize: function (divWidth, givenWidths) {
            var lazyWidths = (function() {
                return givenWidths.sort(function(a,b) {
                    return a - b;
                });
            }(givenWidths));

            var resizeWidth = lazyWidths[lazyWidths.length - 1];
            for (var i = lazyWidths.length - 1; i >= 0; i--) {
                var currentWidth = lazyWidths[i];
                var nextLargest = lazyWidths[--i];

                resizeWidth = (divWidth <= currentWidth && divWidth >= nextLargest)?
                        currentWidth : nextLargest;
            }
            return resizeWidth;
        }, 

        resizeHandler: function() {
            var pw = _.imgTags[0].parentElement.offsetWidth, 
                size = _.findRightSize(pw, _.givenWidths);

                for (var p = 0; p < _.lazySizes[size].length; p++) {
                    _.images[p].src = this.lazySizes[size][p]; 
                }
        },

        resizeThrottler: function() {
            if (!_.resizeTimeout) {
                _.resizeTimeout = setTimeout(function() {
                    _.resizeTimeout = null;
                    _.resizeHandler();
                }, 66);
            }
        }
    };

    return {
        init: function() {
            _.getImageSizes();
            _.resizeThrottler();
            window.addEventListener('resize', _.resizeThrottler, false);
        }
    };

}());

lazySize.init();
