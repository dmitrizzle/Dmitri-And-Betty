


// BACKGROUND ANIMATION AND INTERACTIVITY


// total number of polaroid pictures:
var polaroids = [];
$$('#background > div img').each(function(el,i){
	polaroids[i] = el.get('src');
});

var totalPolaroids = polaroids.length;

// this object will hold random numbers for photo elements:
var photoThrow = {
	z: [],
	rotate: [],
	top: [],
	left: []
};

// fill index array:
for (var i = 0; i < totalPolaroids; ++i){
	photoThrow.z.push(i + 1);
}

// shuffle index array:
photoThrow.z.shuffle();

// fill the rest of the arrays:
for (var i = 0; i < totalPolaroids; ++i){
	photoThrow.rotate[i] = Math.floor((Math.random() * 50) - 25);	
	photoThrow.left[i] = (Math.random() * (window.getSize().x) - window.getSize().x/totalPolaroids );
	photoThrow.top[i] = (Math.random() * (200/totalPolaroids));
}

// background images animation, loading and interaction:
(function(){
	Asset.images(polaroids, {
		onComplete: function(){
		
			// throw the photos:
			$$('#background > div').setStyle('display','block').each(function(el,i){
				(function(){
					el.setStyles({
						'transform':'rotate(' + photoThrow.rotate[i] + 'deg) scale(.75) translateZ(0)',
						'z-index': photoThrow.z[i],
						'left': photoThrow.left[i],
						'top': photoThrow.top[i],
						'opacity': 1
					});
					
					// make images draggable
					new Drag(el ,{
						onStart: function(el){
							// move all other photos onto background
							$$('#background > div').each(function(el,i){
								el.setStyles({
									'transform': 'rotate(' + photoThrow.rotate[i] + 'deg) scale(.7)',
									'transition': ''
								});
							});
							// move draggable photo to foreground
							el.setStyles({
								'z-index': totalPolaroids + 1,
								'transform': 'rotate(0) scale(.85)'
							});
							// generate new rotation angle for when the photo gonna get dropped:
							photoThrow.rotate[i] = Math.floor((Math.random() * 50) - 25);
						},
						onDrag: function(el){
							// remove transitions on drag to improve performance:
							(function(){ el.setStyle('transition', '0ms'); }).delay(500);
						},
						onComplete: function(el){
							// reset all photos:
							$$('#background > div').each(function(el,i){
								el.setStyles({
									'z-index': el.getStyle('z-index') - 1,
									'transform': 'rotate(' + photoThrow.rotate[i] + 'deg) scale(.75)',
									'transition': ''
								});
							});
						}
					});
				}).delay(photoThrow.z[i]*150); // sequence drop animation
			});
		}
	});
}).delay(2250);







// LINKS AND NAVIGATION


$$('body > header a').addEvent('click', function(){ $('background').toggleClass('blur'); });
