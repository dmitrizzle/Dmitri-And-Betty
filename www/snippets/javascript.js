var bodyHeader = $$('body > header')[0];


// BACKGROUND ANIMATION AND INTERACTIVITY


// load fonts, first three images and send signal to start animations:
var percentLoaded = 0;
function loadingIndicator(value){
	percentLoaded = value;
	if(value < 100){
		$('pageLoadingIndicator').setStyle('width', value + '%');
	}else if(value == 100){
		$('pageLoadingIndicator').setStyles({
			'width': '100%',
			'opacity': 0
		});
	}
}
(function(){ loadingIndicator(20); }).delay(100);
WebFont.load({
	google: {
		families: [ 'Great+Vibes::latin', 'Didact+Gothic::latin' ]
	},
	active: function() {
		loadingIndicator(40);
		window.addEvent('domready', function(){
			loadingIndicator(45);
			// load first 3 images
			var firstThreePolaroidsEls = polaroids.slice(0,1);
			var firstThreePolaroids = [];
			firstThreePolaroidsEls.each(function(el,i){
				firstThreePolaroids[i] = firstThreePolaroidsEls[i].get('src');
			});
			Asset.images(firstThreePolaroids, {
				onComplete: function(){
					loadingIndicator(90);
					window.fireEvent('stylesready');
					// console.log('stylesready');
				}
			});
		});
	},
});
    
    
// shuffle polaroid images:
var shuffled = $$('#background > div').shuffle();
$$('#background > div').destroy();
shuffled.inject($('background'));

// total number of polaroid pictures:
var polaroids = [];
$$('#background > div img').each(function(el,i){
	polaroids[i] = el;
});

var totalPolaroids = polaroids.length;

// this object will hold random numbers for photo elements:
var photoThrow = {
	rotate: [],
	top: [],
	left: []
};

// current loaded photo index:
var photosLoaded = 0;

// fill the rest of the arrays:
for (var i = 0; i < totalPolaroids; ++i){
	photoThrow.rotate[i] = Math.floor((Math.random() * 50) - 25);	
	photoThrow.left[i] = Math.random() * (window.getSize().x/totalPolaroids)*(i+1);
	
	photoThrow.top[i] = Math.random() * (window.getSize().y/totalPolaroids)*(i+1) + bodyHeader.getSize().y/2;
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



// animate intro
window.addEvent('stylesready', function(){
	
	// start loading images:
	polaroidsSize();
	window.addEvent('resizeend', polaroidsSize);
	
	// header animations:
	$$('.beatingHeart').addClass('show');
	$$('body > header h1 span.dmitri').addClass('show');
	$$('body > header h1 span.betty').addClass('show');
	$$('body > header h1').addClass('show');
	(function(){
		bodyHeader.addClass('loaded');
		$$('body > header h1 em').addClass('show');
	}).delay(2250);
	
	
	(function(){ 
		$$('body > header ul li').each(function(el,i){
			el.setStyle('animation','headerMenuDrop 500ms ease '+i*150+'ms forwards');
		});
	}).delay(3500);
	
	(function(){
		// number count down animation:
		$$('body > header em > i').each(function(el,i){
			(function(){ incrementAnimate(el); }).delay(i*200);
		});
	
		$$('#background > div').each(function(el,i){
			Asset.image(polaroids[i].get('src'), {
				onLoad: function(){
				
					(function(){
						loadingIndicator(percentLoaded + 1);
						console.log(polaroids[photosLoaded].get('src'));
					
						// throw the loaded image on the screen:
						el.setStyles({
							'transform':'rotate(' + photoThrow.rotate[photosLoaded] + 'deg) scale(.75) translateZ(0)',
							'z-index': photosLoaded,
							'left': photoThrow.left[photosLoaded],
							'top': photoThrow.top[photosLoaded],
							'opacity': 1
						});
					
						photosLoaded ++;
					}).delay(i*150);
					
					
					// make images draggable:
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
							photoThrow.rotate[photosLoaded] = Math.floor((Math.random() * 50) - 25);
						},
						onDrag: function(el){
							// remove transitions on drag to improve performance:
							(function(){ el.setStyle('transition', '0ms'); }).delay(500);
						},
						onComplete: function(el){
							// reset all photos:
							$$('#background > div').each(function(el,i){
								el.setStyles({
									'transform': 'rotate(' + photoThrow.rotate[i] + 'deg) scale(.75)',
									'transition': ''
								});
								if(el.getStyle('z-index') > 0){
									el.setStyles({ 'z-index': el.getStyle('z-index') - 1 });
								}
							});
						}
					});
					
				}
			});
		});
	}).delay(2250);
});

			



// show right size images
var resizeTimer = null;
window.addEvent('resize', function(){
	//create end scroll event
	if(resizeTimer !== null) {
		clearTimeout(resizeTimer);  
	}
	resizeTimer = setTimeout(function() {
		  window.fireEvent('resizeend');
	}, 500);
});

function polaroidsSize(){

	//small
	if(window.getSize().x < 850){
		$$('#background > div img').each(function(el,i){
			el.set('src', el.get('data-src').replace('/img/','/img/s'));
			
		});
	}
	
	//large
	else{
		$$('#background > div img').each(function(el,i){
			el.set('src', el.get('data-src'));
		});
	}
	
}










// LINKS AND NAVIGATION

// top menu action links:
$$('body > header a').addEvent('click', function(){
	page('show', this);
});
$$($$('body > header > h1'),$('background')).addEvent('click', function(){
	page('hide');
});



// animation when content loads:
function stringWordAnimation(){
	$$('body > main .hangingOnAString').each(function(el){
		tempRotate = ((Math.random() * 0.0002) - 0);
		if((Math.random() - 1) > 0){
			tempRotate = ((Math.random() * -.0002) - 0);
		}
		el.setStyle('transform', 'matrix3d(0.98,0,0.17,' + ((Math.random() * 0.0002) - 0) +',0.00,1,0.00,0,-0.17,0,0.98,0,0,0,0,1)');
	});
}

// scroll constructor for window:
var scrl = new Fx.Scroll($(document.body));
var currentPage = false;
function page(action, el){
	scrl.start(0,0);
	
	// show appropriate page/content element:
	if(action == 'show'){
		
		// hide all visible articles:
		$$('body > main article').setStyles({
			'transform': '',
			'z-index': '',
			'opacity': 0,
		});
		
		// current page element
		currentPage = el.get('class');
		articleEl = $('article'+ currentPage.capitalize());
		console.log(articleEl);
		
		// hide all inactive pages:
		/*(function(){
			$$('body > main article').each(function(el,i){
				if(el.get('id') !== 'article'+ currentPage.capitalize()){
					el.setStyle('display','none');
				}else{
					el.setStyle('display','');
				}
			});
		}).delay(500);*/
		
		
		// prepare content canvas:
		$('background').addClass('blur');
		$$('body > main').setStyle('display','block');
		(function(){ $$('body > main').addClass('show'); }).delay(150);
		$$('body').setStyle('height', 'calc(100vh + 3em)');
		
		// highlight menu selections:
		$$('body > header li').removeClass('selected');
		el.getParents('li')[0].addClass('selected');
		
		// load content:
		if(articleEl.get('html') == ''){
		
			// load content:
			new Request.HTML({
				url: currentPage.hyphenate() + '.html',
				noCache: true,
				onSuccess: function(tree, elements, html, js){
					// show current article:
					articleEl.setStyles({
						'opacity': 1,
						'transform': 'translateY(0)',
						'z-index': 2
					});
					articleEl.set('html', html);
					console.log(currentPage.hyphenate() + '.html');
				
					// 3D rotation effect for text blocks:
					$$('body > main p').addClass('hangingOnAString');
					$$('body > main h1').addClass('hangingOnAString');
					$$('body > main h2').addClass('hangingOnAString');
					$$('body > main ul li').addClass('hangingOnAString');
					stringWordAnimation.delay(100);
				
					if(currentPage == 'RSVP'){
					$$('strong.beatingHeart')[0].clone().inject($('loadingRSVP'));
						$('JotFormIFrame').addEvent('load', function(){
							console.log('form loaded');
							$('loadingRSVP').addClass('hide');
						});
					}
					
					// anchor links to smooth scroll:
					// external links:
					$$('body > main a').each(function(el,i){
						anchor = el.get('href');
						if(anchor.contains('#')){
							console.log(anchor);
							
							el.addClass('internal').set('title','Scroll to ' + anchor + ' on this page.');
							el.addEvent('click', function(e){
								e.stop();
								target = $$(el.get('href'))[0];
								scrl.start(0, target.getPosition().y - 100);
								
								target.setStyles({'transition': 'all 500ms'});
								target.addClass('highlight');
								(function(){ target.removeClass('highlight'); }).delay(1000);
							});
						}
						else if(el.get('rel').contains('nofollow')){
							el.addClass('external').set('title','This link will open an external website in another window.');
						}
					});
					
				}
			}).get();
		}
		else {
			articleEl.setStyles({
				'opacity': 1,
				'transform': 'translateY(0)',
				'z-index': 2,
				'display': 'block'
			});
			// animate if tab button clicked again:
			stringWordAnimation.delay(250);
		}
	}
	
	// hide all page content:
	else if(action == 'hide'){
		currentPage = false;
		
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
		
		// restore header:
		bodyHeader.removeClass('hide');
		$$('body > header ul').setStyle('display','inline-block');
		
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
	if(currentPage && scrollY > 20 && window.getScroll().y > scrollYi + 10 && !bodyHeader.hasClass('hide')){
		bodyHeader.addClass('hide');
		if(window.getSize().x < 800){
			(function(){ $$('body > header ul').setStyle('display','none'); }).delay(500);
		}
		scrollYi = scrollY;
	}
	
	// restore header menu on scroll up:
	if(
		(scrollY < 100 || window.getScroll().y < scrollYi)
		// avoid jumping header animation once reached bottom of page:
		&& $(document.body).scrollHeight > ($(document.body).scrollTop + window.innerHeight + 50)
		&& bodyHeader.hasClass('hide')
	){
		bodyHeader.removeClass('hide');
		$$('body > header ul').setStyle('display','inline-block');
		scrollYi = scrollY;
	}
});












