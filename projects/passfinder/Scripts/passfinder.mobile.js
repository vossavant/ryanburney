/**
 *	Vail PassFinder
 *	Mobile JavaScript
 *
 *	Modified: Aug 24, 2014 @ Ryan B / Faction Media
 *
 *	This file contains methods that are only required for mobile devices.
 *	It is dependent on passfinder.common.js.
 */

$(function () {
	isMobile = true;

	/** load methods common to desktop and mobile */
	passfinder.init();

	/** load mobile-specific methods */
	passfinder.mobile.init();
});


passfinder.mobile = {
	/**
	 *	Initialization method - loads all required methods
	 */
	init: function () {		
		passfinder.mobile.hideResortFlyout();
		passfinder.mobile.restart();
		passfinder.mobile.selectNumber();
		passfinder.mobile.selectResort();
		passfinder.mobile.showFirstStep();
		passfinder.mobile.showNextStep();
		passfinder.mobile.showPrevStep();
		passfinder.mobile.showResortFlyout();
	},


	/**
	 *	Hides the resort selection flyout that appears on step one.
	 *	This flyout contains a list of all resorts for a particular
	 *	region, and a button for closing the flyout.
	 *
	 *	When the flyout was created, it was shifted in the DOM, out of
	 *	the list of regions. To prevent content from shifting around,
	 *	we copy the flyout before moving it (the placeholder) and insert
	 *	it where the flyout was. Once the flyout is closed, it is moved
	 *	back to its original spot in the DOM, and the placeholder removed.
	 */
	hideResortFlyout: function () {
		$('.step').on('click', '.flyout button', function () {
			var flyout 			= $(this).closest('.flyout'),
				listWrapper 	= $('#list-wrapper'),
				placeholder		= listWrapper.find('[data-group="' + flyout.attr('data-group') + '"].placeholder'),
				matchingLegend,
				stepOneWrapper 	= $('.step.one'),
				switchWrapper 	= $('#yesno-wrapper');

			/**
			 *	If at least one resort in the active group is checked, add a "selected" class
			 *	to the region, adjust padding on the region list so the "next" button doesn't
			 *	overlap the scrollable region selection area, and animate out the flyout.
			 */
			if (flyout.find('input:checked').length) {
				flyout.addClass('selected');
				stepOneWrapper.css('padding-bottom', '60px');
				stepOneWrapper.find('button').animate({'bottom' : 0}, 500, 'easeInOutQuart');

			/** if no resorts selected in this region, remove the "selected" class */
			} else {
				flyout.removeClass('selected');
				placeholder.removeClass('selected');

				/**
				 *	If no other regions have a selected resort, hide the "next" button
				 *	and remove padding on the scrollable area so it extends to page bottom
				 */
				if (!listWrapper.find('fieldset.selected').length) {
					stepOneWrapper.find('button').animate({'bottom' : '-60px'}, 500, 'easeInOutQuart');
					stepOneWrapper.css('padding-bottom', 0);
				}
			}

			/** filter passes based on selections */
			passfinder.resetPasses('checked');

			/**
			 *	Fade out the resort list, wait a second, then animate out the flyout.
			 *	re-add it to its original place in the list of resort regions, and
			 *	remove the placeholder.
			 */
			flyout.find('> *').animate({'opacity' : 0});
			flyout.delay(100).animate({'left' : '-90%'}, 500, 'easeInOutQuart', function() {
				placeholder.after(flyout);
				placeholder.remove();
				
				/** trim "Resorts" from the legend - this was appended when the flyout was created */
				matchingLegend = flyout.find('legend');
				matchingLegend.text(matchingLegend.text().slice(0, -8));

				/** remove the "Done" button and inline styles added by .animate() */
				flyout.find('.btn-wrap').remove();
				flyout.find('> *').removeAttr('style');
				flyout.removeClass('flyout');

				/**
				 *	Check which resorts are chosen and display yes/no questions accordingly.
				 *	The first bit hides all questions, and the second bit shows only those
				 *	questions whose data- attribute matches selected resorts.
				 */
				listWrapper.find('input').each(function () {
					switchWrapper.find('[data-question="' + $(this).attr('data-questions') + '"]').hide();
				});
				listWrapper.find('input:checked').each(function () {
					switchWrapper.find('[data-question="' + $(this).attr('data-questions') + '"]').show();
				});
			});
		});
	},


	/**
	 *	Sends the user back to the start screen. Called when a user clicks the "Start Over"
	 *	button on the final screen.
	 */
	restart: function () {
		$('.restart').click(function () {
			var listWrapper 	= $('#list-wrapper'),
				restartButton	= $(this);

			restartButton.animate({'bottom' : '-60px'}, 250, 'easeInOutQuart', function () {

				/** smooth scroll to top of page, then animate all steps to their original positions */
				$( 'html, body' ).stop().animate({'scrollTop' : $('body').offset().top}, 500, 'easeInOutQuart', function () {
					restartButton.closest('.step').find('h1').removeClass('fixed');
					
					$('.step').animate({'left' : '102%'}, 500, 'easeInOutQuart', function () {
						/** reset selections in step 1 (choose resort) */
						listWrapper.find('.selected').removeClass('selected');
						listWrapper.find('input').prop('checked', false);
						$('.step.one').css('padding-bottom', 0);

						/** reset selections in step 2 (choose days) */
						$('#number-wrapper').find('select').prop('selectedIndex', 0);
						$('.day-count').text('Day');

						/** reset selections in step 3 (toggle options) */
						$('#yesno-wrapper').find('.question.yes').removeClass('yes');

						/** reset UI */
						$('.step.one').find('.next').css('bottom', '-60px');
						$('.step').find('h1 + div').hide();

						/** reset passes */
						passfinder.resetPasses();
					});
				});
			});
		});
	},


	/**
	 *	Tracks user interaction with the "choose days" dropdown menu. Called on page load
	 *	so we can set the default selection to 1.
	 */
	selectNumber: function () {
		var selectedValue = 1;

		$('.question').find('select').change(function () {
			selectedValue = $(':selected', this).val();

			if (selectedValue == 1) {
				$(this).closest('.question').find('.day-count').text('Day');
			} else {
				$(this).closest('.question').find('.day-count').text('Days');
			}

			/** when a new selection is made */
			passfinder.mobile.setPerdiemPrices(selectedValue);
			passfinder.resetPasses('slid');

			/** format 10+ days for Omniture tracking */
			if (selectedValue === 11) {
				selectedValue = '10+';
			}

			/** fire Omniture event */
			s.tl(this, 'o', $(this).closest('.question').attr('data-pev2') + ':' + selectedValue);
		});
	},


	/**
	 *	Tracks user selection of resorts in the left hand flyout menu.
	 *	Tapping a resort un/selects it, un/checks the corresponding
	 *	hidden checkbox, and fires an Omniture event.
	 */
	selectResort: function () {
		var listWrapper = $('#list-wrapper'),
			selectedResort;

		$('.step').on('mousedown', 'label', function () {
			selectedResort = $(this);
			selectedResort.toggleClass('selected');
			selectedResort.find('input').prop('checked');

			/** fire Omniture click event */
			s.tl(this, 'o', listWrapper.attr('data-pev2') + ':' + selectedResort.find('input').attr('name'));
		});
	},


	/**
	 *	Set the per diem price for each pass (pass price / number of days)
	 */
	setPerdiemPrices: function (selectedValue) {
		setTimeout(function () {
			$('.pass').each(function () {
				passWrapper = $(this);
				passPrice = passWrapper.find('.dollars');

				/** special case if user selects 10+ days */
				if (selectedValue === '10+') {
					passWrapper.find('.perdiem').html('less than $<span>' + Math.round(passPrice.text() / 10) + '</span><small>/day</small></span>');
				} else {
					/** daily lift ticket base price is stored in a data-daily-price attribute to prevent endless multiplication */
					if (passWrapper.attr('data-passname') === 'Daily Lift Ticket') {
						passPrice.text(passPrice.attr('data-daily-price') * selectedValue);
					}
					
					passWrapper.find('.perdiem').html('$<span>' + Math.round(passPrice.text() / selectedValue) + '</span><small>/day</small></span>');
				}
			});
		}, 1000);
	},


	/**
	 *	Show the first step (select resort) after the user taps question one
	 *	on the mobile home screen. The first step is fired in a different way
	 *	from the other steps, and so needs a distinct method.
	 */
	showFirstStep: function () {
		$('menu').find('.choose-resort').click(function () {
			$('.step.one').show().animate({'left' : 0}, 500, 'easeInOutQuart', function () {
				var stepOne = $(this);

				stepOne.find('h1').addClass('fixed');
				stepOne.find('h1 + div').fadeIn();
			});
		});
	},


	/**
	 *	Except for the first step (select resort), shows the following step
	 *	when the user taps "Next"
	 */
	showNextStep: function () {
		$('.next').click(function () {
			var currentStep = $(this).closest('.step'),
				nextStep 	= currentStep.next(),
				numberSelect,
				selectedValue;

			/** exit current step */
			currentStep.find('button').animate({'bottom' : '-60px'}, 500, 'easeInOutQuart');			
			currentStep.find('h1').removeClass('fixed');

			/**
			 *	If current step is 2 (select days), calculate per diem and
			 *	apply filters. This is to cover the case where the user doesn't
			 *	interact with the dropdown menu.
			 */
			if (currentStep.hasClass('two')) {
				numberSelect = currentStep.find('.question').find('select');
				selectedValue = $(':selected', numberSelect).val();
				passfinder.mobile.setPerdiemPrices(selectedValue);
				passfinder.resetPasses('slid');
			}
			
			/** enter next step */
			nextStep.show().animate({'left' : 0}, 500, 'easeInOutQuart', function () {
				nextStep.find('h1').addClass('fixed');
				nextStep.find('button').animate({'bottom' : 0}, 250, 'easeInOutQuart');
				nextStep.find('h1 + div').fadeIn();
			});
		});
	},


	/**
	 *	Shows the previous step when the user taps "Back"
	 *	(ignore taps on the final "Restart" button)
	 */
	showPrevStep: function () {
		$('.prev').not('.restart').click(function () {
			var currentStep = $(this).closest('.step'),
				prevStep 	= currentStep.prev();

			/** exit current step */
			currentStep.find('button').animate({'bottom' : '-60px'}, 500, 'easeInOutQuart');
			currentStep.find('h1').removeClass('fixed');

			/** enter previous step */
			currentStep.animate({'left' : '102%'}, 500, 'easeInOutQuart', function () {
				prevStep.find('button').animate({'bottom' : 0}, 250, 'easeInOutQuart');
				prevStep.find('h1').addClass('fixed');
			});
		});
	},


	/**
	 *	Shows the left hand resort flyout for a specific resort region.
	 *	Fired when a user clicks on one of the resort regions (e.g., Colorado)
	 */
	showResortFlyout: function () {
		$('.step').on('click', 'legend', function () {
			var chromeHeight,
				groupDrawer = $(this).closest('fieldset'),
				groupTitle = groupDrawer.find('legend'),
				placeholder = groupDrawer.clone().addClass('placeholder');

			/** drop in a placeholder so the group list don't shrink when the legend is moved */
			groupDrawer.before(placeholder);

			/**
			 *	Add a "Done" button to the bottom of the flyout, append "Resorts"
			 *	to the region's <legend> title, and move the resort list for the
			 *	selected region elsewhere in the DOM for easier selection.
			 */
			groupDrawer.addClass('flyout').append('<div class="btn-wrap"><button>Done</button></div>');
			groupTitle.text(groupTitle.text() + ' Resorts');
			$('.step.one').prepend(groupDrawer);

			/**
			 *	Set height of resort list dynamically, so the scrollable area
			 *	always fits between the title and the "Done" button
			 */
			chromeHeight 		= groupTitle.outerHeight() + groupDrawer.find('.btn-wrap').outerHeight();
			scrollableHeight 	= groupDrawer.outerHeight() - chromeHeight;
			groupDrawer.find('.scrollbox').height(scrollableHeight);

			/** animate in the drawer and fade in its contents */
			groupDrawer.animate({'left' : 0}, 500, 'easeInOutQuart');
			groupDrawer.find('> *').delay(250).animate({'opacity' : 1}, 500);
		});
	}
}