


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
	photoThrow.left[i] = Math.random() * (window.getSize().x/totalPolaroids)*(i+1);
	
	photoThrow.top[i] = Math.random() * (window.getSize().y/totalPolaroids)*(i+i) + $$('body > header')[0].getSize().y/2;
}

// number increment animation:
function incrementAnimate(el){
	var target = parseInt(el.get('html'));
    var number = 0;
    
	var interval = setInterval(function() {
		el.set('html', number);
		if (number >= target) clearInterval(interval);
		number++;
	}, 20);
}

window.addEvent('domready', function(){
	(function(){ $$('body > header h1 strong svg').setStyle('display','inline-block'); }).delay(100);
});

// background images animation, loading and interaction:
(function(){

	// number count down animation:
	$$('body > header em > i').each(function(el,i){
		(function(){ incrementAnimate(el); }).delay(i*200);
	});
	
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

// top menu action links:
$$('body > header a').addEvent('click', function(){
	page('show', this);
});
$$($$('body > header > h1'),$('background')).addEvent('click', function(){
	page('hide');
});

// add animation class for all text and headers:
$$('body > main p').addClass('hangingOnAString');
$$('body > main h1').addClass('hangingOnAString');

// scroll constructor for window:
var scrl = new Fx.Scroll($(document.body));

function page(action, el){
	scrl.start(0,0);
	
	// show appropriate page/content element:
	if(action == 'show'){
		// hide all visible article:
		$$('body > main article').setStyles({
			'transform': '',
			'opacity': '',
			'z-index': ''
		});
		$$('body > main article').setStyle('opacity',0);
		// show current article:
		$('article'+el.get('html').replace(' ','')).setStyles({
			'opacity': 1,
			'transform': 'translateY(0)',
			'z-index': 2
		});
		
		// prepare content canvas:
		$('background').addClass('blur');
		$$('body > main').setStyle('display','block');
		(function(){ $$('body > main').addClass('show'); }).delay(150);
		$$('body').setStyle('height', 'calc(100vh + 3em)');
		
		// highlight menu selections:
		$$('body > header li').removeClass('selected');
		el.getParents('li')[0].addClass('selected');
		
		// 3D rotation effect for text blocks:
		(function(){
		$$('body > main .hangingOnAString').each(function(el){
			tempRotate = ((Math.random() * 0.0002) - 0);
			if((Math.random() - 1) > 0){
				tempRotate = ((Math.random() * -.0002) - 0);
			}
			el.setStyle('transform', 'matrix3d(0.98,0,0.17,' + ((Math.random() * 0.0002) - 0) +',0.00,1,0.00,0,-0.17,0,0.98,0,0,0,0,1)');
		});
		}).delay(100);
	}
	
	// hide all page content:
	else if(action == 'hide'){
		// hide all visible articles:
		$$('body > main article').setStyles({
			'transform': '',
			'opacity': '',
			'z-index': ''
		});

		// restore background:
		$('background').removeClass('blur');
		$$('body > main').removeClass('show');
		(function(){
			$$('body > main').setStyle('display','');
			$$('body').setStyle('height', '');
		}).delay(500);
		
		// remove menu selections:
		$$('body > header li').removeClass('selected');
		$$($$('body > main p'),$$('body > main p')).each(function(el,i){
			el.setStyle('transform', 'rotateY(0deg)');
		});
	}
}


// control header height on small screens:
var scrollYi = 0;
window.addEvent('scroll', function(){
	scrollY = window.getScroll().y;
	
	// hide part of header on scroll down:
	if(scrollY > 100 && window.getScroll().y > scrollYi + 10){
		$$('body > header').addClass('hide');
		(function(){ $$('body > header ul').setStyle('display','none'); }).delay(500);
		scrollYi = scrollY;
	}
	
	// restore header menu on scroll up:
	if(
		(scrollY < 100 || window.getScroll().y < scrollYi)
		// avoid jumping header animation once reached bottom of page:
		&& $(document.body).scrollHeight > ($(document.body).scrollTop + window.innerHeight + 50)
	){
		$$('body > header').removeClass('hide');
		$$('body > header ul').setStyle('display','inline-block');
		scrollYi = scrollY;
	}
});








