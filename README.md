# lazysize
Responsive resolution image scaler

Instructions:
 1. place 'src-set' attribute on the image tag
 2. for 'src-set' values, place the image location followed by one space and the breakpoint width
      ex: <img src-set="/path/to/image.png 1024" / >
 3. seperate each additional image and breakpoint by one comma and no space
      ex: <img src-set="/path/to/image.png 1024,/path/to/nextImage.png 768" / >
 4. place the class name 'lazysize' on the image tag
      ex: <img class="lazysize" src-set="/path/to/image.png 1024,/path/to/nextImage.png 768" / >
 
