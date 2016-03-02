


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


$$('body > header a').addEvent('click', function(){
	page('show', this);
});
$$($$('body > header > h1'),$('background')).addEvent('click', function(){
	page('hide');
});

$$('body > main p').addClass('hangingOnAString');
$$('body > main h1').addClass('hangingOnAString');


var scrl = new Fx.Scroll($(document.body));

function page(action, el){
	scrl.start(0,0);
	
	if(action == 'show'){
		$$('body > main article').setStyles({
			'transform': '',
			'opacity': '',
			'z-index': ''
		});
		$$('body > main article').setStyle('opacity',0);
		$('article'+el.get('html').replace(' ','')).setStyles({
			'opacity': 1,
			'transform': 'translateY(0)',
			'z-index': 2
		});
		
		$('background').addClass('blur');
		$$('body > main').setStyle('display','block');
		(function(){ $$('body > main').addClass('show'); }).delay(150);
		$$('body > header li').removeClass('selected');
		el.getParents('li')[0].addClass('selected');
		
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
	else if(action == 'hide'){
		$$('body > main article').setStyles({
			'transform': '',
			'opacity': '',
			'z-index': ''
		});

		$('background').removeClass('blur');
		$$('body > main').removeClass('show');
		(function(){ $$('body > main').setStyle('display',''); }).delay(500);
		$$('body > header li').removeClass('selected');
		$$($$('body > main p'),$$('body > main p')).each(function(el,i){
			el.setStyle('transform', 'rotateY(0deg)');
		});
	}
}









