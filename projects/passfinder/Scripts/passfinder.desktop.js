/**
 *	Vail PassFinder
 *	Mobile JavaScript
 *
 *	Modified: Aug 25, 2014 @ Ryan B / Faction Media
 *
 *	This file contains methods that are only required for desktop devices.
 *	It is dependent on passfinder.common.js.
 */

$(function () {
	/** load methods common to desktop and mobile */
	passfinder.init();

	/** load desktop-specific methods */
	passfinder.desktop.init();
});


passfinder.desktop = {
	/**
	 *	Initialization method - loads all required methods
	 */
	init: function () {
		passfinder.desktop.loadOptions();
		passfinder.desktop.resortAccordion();
		passfinder.desktop.selectResorts();
		passfinder.desktop.slider();
	},


	/**
	 *	Loads hero and placeholder images into the DOM
	 */
	loadOptions: function () {
		var heroImage = $('<img />', { alt: heroImageAlt, src: heroImageSrc }),
			placeholderImage = $('<img />', { alt: placeholderImageAlt, src: placeholderImageSrc });
		
		$('#hero').html(heroImage);
		$('#placeholder').html(placeholderImage);
	},


	/**
	 *  Custom, lightweight accordion for showing/hiding the sidebar
	 *	resort selection widget
	 */
	resortAccordion: function () {
		/** Choose resorts */
		$('.choose-resort').click(function () {
			var listWrapper = $('.scrollbox'),
				resortHeader = $(this);

			resortHeader.toggleClass('open');

			/** if the widget isn't open, open it and fade in the contents */
			if (resortHeader.hasClass('open')) {
				listWrapper.slideDown(250, function () {
					listWrapper.find('fieldset').fadeIn(250, function () {
						$('.scrollbox').perfectScrollbar('update');
					});
				});
			} else {
				listWrapper.find('fieldset').fadeOut(250, function () {
					listWrapper.slideUp();
				});
			}
		});
	},


	/**
	 *  Handles user click events on resort checkboxes
	 */
	selectResorts: function () {
		var dailyPassPrice	= $('#pass-list').find('[data-passname="Daily Lift Ticket"]').find('.dollars'),
			listWrapper 	= $('#list-wrapper'),
			switchWrapper 	= $('#yesno-wrapper');

		listWrapper.find('input').change(function () {
			checkedBoxCount = listWrapper.find('input:checked').length;

			/**
			 *	User made at least one selection: hide placeholder image
			 *	and show a list of matching passes
			 */
			if (checkedBoxCount > 0) {
				$('#placeholder').fadeOut(500, function () {
					$('main > section > h1').fadeIn(500, function () {
						$(this).removeClass('hidden');
					});

					/** show step 2 (select days) */
					$('.choose-days').removeClass('disabled');
					$('.choose-days + div').slideDown(500, function () {
						$(this).find('.transparent').animate({ opacity: 1 });
					});

					/** show step 3 (yes/no questions) */
					$('.choose-other').removeClass('disabled');
					$('.choose-other + div').slideDown(500, function () {
						$(this).find('.transparent').animate({ opacity: 1 });
					});

					$('#seasonal-text').fadeIn();

					/** run filters based on what the user checked */
					passfinder.resetPasses('checked');
				});

			/**
			 *	User unchecked all boxes: hide passes, reset toggles, slider,
			 *	and passes, restore default welcome screen.
			 */
			} else {
				$('main > section > h1').fadeOut(500);
				$('#pass-list').fadeOut(500, function () {
					$('#placeholder').fadeIn(500);
					$('.loading').fadeOut(500);
				});

				/** hide step 2 */
				$('.choose-days').addClass('disabled');
				$('.choose-days + div').find('.transparent').animate({opacity: 0}, function () {
					$('.choose-days + div').slideUp();

					/** reset slider to 1 day */
					$('#slider').slider('value', 1);
					$('#day-count').find('p').text(1);
					$('#day-count').find('span').text('Day');
				});

				/** hide step 3 */
				$('.choose-other').addClass('disabled');
				$('.choose-other + div').find('.transparent').animate({opacity: 0}, function () {
					$('.choose-other + div').slideUp();

					/** reset yes/no switches to "no" */
					$('#yesno-wrapper').find('.question.yes').removeClass('yes');
				});

				$('#seasonal-text').fadeOut();

				/** reset daily pass per diem price */
				dailyPassPrice.text(dailyPassPrice.attr('data-daily-price'));
			}

			/**
			 *	Regardless of whether there are selected boxes, check which resorts
			 *	are chosen and show/hide step 3 toggle questions accordingly. First,
			 *	hide all questions, then show questions whose data-question attribute
			 *	is found in any checked boxes.
			 */
			listWrapper.find('input').each(function () {
				switchWrapper.find('[data-question="' + $(this).attr('data-questions') + '"]').hide();
			});
			listWrapper.find('input:checked').each(function () {
				switchWrapper.find('[data-question="' + $(this).attr('data-questions') + '"]').show();
			});

			/** fire Omniture click event */
			s.tl(this, 'o', listWrapper.attr('data-pev2') + ':' + $(this).attr('name'));
		});
	},


	/**
	 *  Initialize the jQuery UI Slider and filter passes based on
	 *  the selected number of days.
	 */
	slider: function () {
		var dayCount,
			dayWrapper = $('#day-count'),
			passPrice,
			passWrapper,
			sliderValue;

		/** set range between 1 and 11 with an increment and initial value of 1 */
		$('#slider').slider({
			max		: 11,
			min 	: 1,
			range	: 'min',
			step	: 1,
			value 	: 1,

			/** adjust text output based on # of days selected */
			slide: function (event, ui) {
				dayCount = ui.value;

				if (dayCount === 11) {
					dayWrapper.find('p').text('10+');
				} else {
					dayWrapper.find('p').text(dayCount);
				}

				if (dayCount !== 1) {
					dayWrapper.find('span').text('Days');
				} else {
					dayWrapper.find('span').text('Day');
				}
			},

			/** this method fires once a selection is made */
			stop: function (event, ui) {
				passfinder.resetPasses('slid');

				/** if resort box is open, collapse it */
				if ($('.choose-resort.open').length) {
					$('.choose-resort').removeClass('open');
					$('#list-wrapper').find('fieldset').fadeOut(250, function () {
						$('.scrollbox').slideUp();
					});
				}

				/** format 10+ days for Omniture tracking */
				if (ui.value === 11) {
					sliderValue = '10+';
				} else {
					sliderValue = ui.value;
				}

				/** fire Omniture event */
				s.tl(this, 'o', $('#number-wrapper').find('.question').attr('data-pev2') + ':' + sliderValue);

				/** set per diem prices */
				setTimeout(function () {
					$('.pass').each(function () {
						passWrapper = $(this);
						passPrice 	= passWrapper.find('.dollars');

						if (passWrapper.attr('data-passname') === 'Daily Lift Ticket') {
							passPrice.text(passPrice.attr('data-daily-price') * ui.value);
						}
						
						passWrapper.find('.perdiem span').text(Math.round(passPrice.text() / ui.value));
					});
				}, 500);
			}
		});

		sliderValue = $('#slider').slider('value');

		/** set day count (initial page load) */
		dayWrapper.find('p').text(sliderValue);

		/** proper grammar */
		if ($('#slider').slider('value') !== 1) {
			dayWrapper.find('span').text('Days');
		} else {
			dayWrapper.find('span').text('Day');
		}
	}
}