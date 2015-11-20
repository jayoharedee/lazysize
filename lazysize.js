var lazySize = (function() {
	var _ = {
		images: [],

		lazySizes: {},

		resizeTimeout: null,

		givenWidths: [],

		imgTags: document.getElementsByClassName('lazysize'),

		/**
		 * gets all image tags with a lazysize css class
		 */
		getImageSizes: function() {
			var images = _.imgTags; 

			for (var i = images.length - 1; i >= 0; i--) {
				var image = images[i];
				this.images.push(image);
				var srcSet = image.getAttribute('src-set');
				srcSet = srcSet.split(',');

				for (var j = srcSet.length - 1; j >= 0; j--) {
					var src = srcSet[j].split(' '),
						width = src[1],
						imgSrc = src[0];

					if (!this.lazySizes[width]) {
						this.lazySizes[width] = [imgSrc];
						continue;
					}

					this.lazySizes[width].push(imgSrc);

					if (this.givenWidths.indexOf(width) < 0) {
						this.givenWidths.push(width);
					}
				}
			}
			console.log(this.lazySizes);
		},

		/**
		 * takes current width of the image tags parent div and compares
		 * with the breakpoints provided in the image src-set attribute
		 * @param divWidth width of image tags parent div
		 * @param givenWidth array of all the breakpoints from image tags
		 * @return resizeWidth the calculated breakpoint that the image should be resized to
		 */
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

		/**
		 * loops through an array of the corresponding breakpoints object property
		 * replaces all current image src tags with the new breakpoint image
		 */
		resizeHandler: function() {
			var pw = _.imgTags[0].parentElement.offsetWidth, 
				size = _.findRightSize(pw, _.givenWidths);

				for (var p = 0; p < _.lazySizes[size].length; p++) {
					console.log(_.lazySizes[size][p]);
					_.images[p].src = this.lazySizes[size][p]; 
				}
		},

		/**
		 * event handler that is attached to the resize event listener
		 */
		resizeThrottler: function() {
			if (!this.resizeTimeout) {
				this.resizeTimeout = setTimeout(function() {
					this.resizeTimeout = null;
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
