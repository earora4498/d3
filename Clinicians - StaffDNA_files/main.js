//================================================================================
// All pages
//================================================================================

// Constants
var $HOSTNAME_PRODUCTION 	=	'www.staffdna.com';
var $STAFFDNA_PRODUCTION	=	'https://secure.staffdna.com/sd-web';
var $STAFFDNA_UAT			=	'http://uat.staffdna.com:8080/sd-web';
var $AJAX_URL				=	'';


// Setting ajax url for requests
if (window.location.hostname == $HOSTNAME_PRODUCTION) {
	$AJAX_URL = $STAFFDNA_PRODUCTION;
} else {
	$AJAX_URL = $STAFFDNA_UAT;
}	

// Collapse generic
$('[data-collapse]').on('click', function() {	
	var $this = $(this);	
	var $target = $('#' + $this.attr('data-collapse'));
	
	var $icon = $this.find('i');
	var $dataChangeIcon = $icon.attr('data-change-icon');
	
	if ($dataChangeIcon) {
		var $originalIcons = $icon.attr('class');		
		$icon.attr('class', $dataChangeIcon);
		$icon.attr('data-change-icon', $originalIcons);							
	}
	
	$this.toggleClass('active');		
	$target.toggle();	
});

// Menu
$('#btn-menu').on('click', function() {
	$('.menu').toggleClass('active');	
});

// Menu > Styling Login
$('.menu li:last').each(function() {
	var $this = $(this);
	var $a = $this.find('a');	
	
	if ($a.text().toUpperCase() == "LOGIN" ) {	
		$a.addClass('btn');
	}
});

// Social share links
$('[data-social]').on('click', function() {
	var $url = $(this).attr('data-social') + window.location.href;
	window.open($url, "socialWindow", "height=450,width=750");	
});

// Auto resize iframe
window.addEventListener("message", function(event) {
    var iframe = document.getElementById(event.data.id)
	var newHeight = event.data.height;
	
	if (iframe) {
		iframe.height = parseInt(newHeight) + "px";
	} else {
		console.error("Not found element id for #"  + event.data.id);
	}
});

//================================================================================
// Home
//================================================================================
if ($('.home').length >= 1) {
	
	// Fetch total count from server for jobs and profiles	
	function getTotalCount() {
		
		var $jobsUrl = $AJAX_URL + '/candidate/getProfileCountForWebsite.srvc';
		
		$.when( $.post($jobsUrl) ).done(function($initial) {			
			var $loadingCounter = $('.loading-counter');
			var $counters = $('.counter');
			
			$loadingCounter.fadeOut('slow', function() {
				
				$counterContainer = $('.counter > span');
				$initial = parseInt($initial);

				$counterContainer.counter({
					format: '999999',
					direction: 'up',
					initial: $initial,
					stop: $initial,
					interval: 1000,
				});
				
				
				function incrementByOne() {
					
					$initial = parseInt($counterContainer.text());						
					$randomStop = $initial + 1;					
												
					$counterContainer.counter({
						format: '999999',
						direction: 'up',
						initial: $initial,
						stop: $randomStop,
						interval: 1000, 
					});		
				}

				(function loop() {
				    var rand = Math.round(Math.random() * (10000 - 3000)) + 3000;
				    setTimeout(function() {
				    	incrementByOne();
				            loop();  
				    }, rand);
				}());			
								
				$('.home #bg .active-text').hide().removeClass('hide').fadeIn('slow', function() {
					$counters.hide().removeClass('hide').fadeIn('slow');					
				});							
				
			});
									
						
		});		
		
	} 	
	
	getTotalCount();
	  
	// Browse Jobs > Lazy load enable custom scroll
	function enableBrowseJobsScroll(event) {
        $('#job-list:in-viewport').each(function () {        				
        	
        	$(window).off('scroll', enableBrowseJobsScroll);
        	
        	populateBrowseJob(null, null, function () {
				 
        		/*
        		$.mCustomScrollbar.defaults.scrollButtons.enable = true; //enable scrolling buttons by default
				$.mCustomScrollbar.defaults.axis="yx"; //enable 2 axis scrollbars by default
				 
				$("#job-list").mCustomScrollbar({										
					callbacks: {
						onTotalScroll : loadMoreJobs,
				        onTotalScrollOffset:350,
					    alwaysTriggerOffsets:false
				    }
				});
				*/
			 });
        				 
        });
    }       
	
	$(window).on('scroll', enableBrowseJobsScroll);
		
	// Browse Jobs > Lazy load pagination
	var $currentPage = 1;
	
	function loadMoreJobs() {		
		
		var $nextPage = $currentPage + 1;
		
		populateBrowseJob($nextPage, null, function() {
			$currentPage++;        		   
		});		
	}		
  
  //Browse Jobs > Populating
  function populateBrowseJob(page, rows, callback) {
  	var page = page || 1;
  	var rows = rows || 15;
  	var jobList = $("#job-list");
  	var loadingIcon = $(".home #browse_jobs .loading");
  	
  	loadingIcon.fadeIn('slow');  	
  	
	$.ajax({
		method: 'POST',
		url: $AJAX_URL + '/candidate/listJobBoardEntries.srvc?page=' + page + '&rows=' + rows + '&sidx=modifiedDate&filterRequest=0'
	  })
	.done(function( data ) {		
		
		var keys = [];
		
		$.each(data.data, function(key, value) {
			var h3Class = '';
			var firstTime = (jobList.html() == "");
			
			if(firstTime)
				jobList.hide();
			
			// CSS business rule
			if (value.profession.length > 13)
				h3Class = 'bigh3';
				
			// Element to append
			var jobCard = '<li class="col-1-4">' +
						'<a href="' + $AJAX_URL + '/account/jobBoardView.do#jobApplicationButton' + value.jobId +'" class="job-card" target="_blank">' +
							'<h3 class="' + h3Class + '">' + value.specialty + '</h3>' +
							'<h4>' + value.profession + '</h4>' +
							'<p><span class="location">' + value.zipcodeData + ', ' + value.state + '</span>' + value.jobLength + ' week' +  ((value.jobLength > 1) ? 's' : '' ) + 
							' , ' + value.employmentType.toLowerCase() + '</i></p>' +
						'</a>' +
					'</li>';
			var blankJobCard = '<li class="col-1-4"><span class="job-card job-card-blank"></span></li>' ;
			
			// Appending
			if (key == 2) {
				jobList.append(blankJobCard);
				jobList.append(blankJobCard);
				jobList.append(jobCard);
			} else {
				var scrollContainer = jobList.find('.mCSB_container');
				
				if(scrollContainer.length >= 1) {
					scrollContainer.append(jobCard);
				} else {
					jobList.append(jobCard);					
				}
			}
			
			// Showing
			if(firstTime)
				jobList.fadeIn('slow');
			
		});
		
		loadingIcon.fadeOut('slow');
		
		if (typeof callback === "function") {			
			callback();
		}
				
	});
  	
  }    
  
  // Viewport fix
  if ($(window).width() <= 736) {
	  $('.nurse-girl').insertAfter($('#browse_jobs p:nth-child(2)'));		  
  };    
  
}

//================================================================================
// Clients
//================================================================================
if ($('.clients').length >= 1) {
	$('.btn-register').on('click', function(e) {
		var $this = $(this);		
		var $divIframe = '<main id="clients-div-iframe" style="display:none"><div class="grid grid-pad"><iframe src="' + $AJAX_URL + '/account/signUpAgency.do?iframe=true" id="signUpAgency" scrolling="no" frameborder="0" width="100%" height="1060"></iframe></div></main>';
		var $main = $('main[role="main"]');
		
		$this.off();
		$this.html('<i class="fa fa-refresh fa-spin fa-fw loading-counter"></i> Loading client application');
		$main.prepend($divIframe);
		
		$('#clients-div-iframe iframe').on('load', function() {
			var $this = $(this);
			var $mainChild = $main.find('main[role="page"]');			

			$mainChild.fadeOut('slow', function () {				
				$('#clients-div-iframe').fadeIn('slow', function () {
					$mainChild.remove();
				});
			});
			
		});
		
		e.preventDefault();
		
	});
}


//================================================================================
// Contact Us
//================================================================================
if ($('.contact-us').length >= 1) {
	var $this = $('.contact-us > main');
	var $form = $this.find('form');
	var $submitInput = $this.find('input[type="submit"]');	
		
	$submitInput.on('click', function(e) {		

		if(!$form[0].checkValidity || $form[0].checkValidity()) {
			var name = $form.find('input[type="text"]').val();
			var email = $form.find('input[type="email"]').val();
			var message = $form.find('textarea').val();
			
			$form.hide();
			
			$.post( "/send-" + "email.php", { name: name, email: email, message: message } );												
			
			var responseMessage = '<div class="grid grid-pad"><h2>Thank You ' + name + '</h2><p>Your message was sent to our Team. ' +
									'You should receive a reply from a representative of our web site by the end of the next business day by email at <b>' + email + '</b>.</p></div>'				
								
			$form.html(responseMessage).show('slow');
			$this.off();			
		}		
	});			
}


//================================================================================
// Blog > Single Post > Comments
//================================================================================
if ($('#respond').length >= 1) {	
	
	function fadeInCommentForm(event) {
        $('#respond:in-viewport').each(function () {        	
        	$(window).off('scroll', fadeInCommentForm);
        	$(this).addClass('visible');
        	$('#comment')
        		.attr('placeholder', 'Write here');
        });
    }       
	
	$(window).on('scroll', fadeInCommentForm);	
	
}