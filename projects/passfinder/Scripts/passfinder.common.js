/**
 *	Vail PassFinder
 *	Mobile JavaScript
 *
 *	Modified: Aug 25, 2014 @ Ryan B / Faction Media
 *
 *	This file contains methods that are required for both desktop and mobile devices.
 */

var passfinder = {
	/**
	 *	Initialization method - loads all required methods
	 */
	init: function () {
		passfinder.accordion();
		passfinder.loadPasses();
		passfinder.loadQuestions();
		passfinder.loadOptions();
		//passfinder.loadResorts(); // re-enable once resorts no longer need to be hard coded
		passfinder.scrollbar();
		passfinder.toggle();
	},

	/**
	 *	Custom, lightweight accordion for showing/hiding passes
	 */
	accordion: function () {		
		/** ignore the first (recommended) pass, since we don't want to ever hide it */
		$('section').on('click', 'article:not(:first-of-type) h2', function () {
			var titleBar = $(this),
				contents = $(this).next(),
				article = titleBar.closest('article'),
				recommendedPass = $('article:not(:first-of-type)');

			/** info pane is open - hide it */
			if (article.hasClass('open')) {
				contents.animate({ opacity: 0 });
				contents.slideUp();
				article.removeClass('open');

			/** info pane is closed - show it */
			} else {
				/** close all other open panes, so only one pane is open at a time */
				recommendedPass.find('> div').animate({opacity: 0});
				recommendedPass.find('> div').slideUp();
				recommendedPass.removeClass('open');

				article.addClass('open');

				contents.slideDown(250, function () {
					contents.animate({ opacity: 1 });

					/** don't track Omniture clicks on the same accordion within 30 seconds - use a class to track this */
					if (!article.hasClass('dont-track')) {
						/** remove the class after 30 seconds */
						article.addClass('dont-track').delay(30000).queue(function() {
							$(this).removeClass('dont-track');
							$(this).dequeue();
						});

						/** fire Omniture tracking event */
						s.tl(this, 'o', article.attr('data-pev2'));
					}
				});
			}
		});

		/** prevent page jump to top */
		$('section').on('click', 'article h2 a', function (e) {
			e.preventDefault();
		});
	},


	/**
	 *	This method is called whenever a user interacts with one of the 3 questions
	 *	(choose resort, select days, choose yes/no to certain questions).
	 *	
	 *	Each pass has a base weight (negative values indicate a pass should not show
	 *	at all in the results) and a number of rules, each of which has one or more
	 *	conditions and a "modifying weight" that should be added to the base weight.
	 *	Whenever all conditions for a rule are met, the modifying weight for that rule
	 *	is added to the base weight of the pass. So, if a rule's modifying weight is
	 *	-1000 and a pass' base weight is 50, the pass' adjusted weight would be -950
	 *	and the pass would be hidden from view.
	 *
	 *	This method loops through each pass, then each rule, then each condition for
	 *	each rule, using data attributes on each pass' DOM element to determine whether
	 *	certain conditions are being met.
	 *
	 *	Ultimately, the pass' overall weight is calculated. Any passes with a negative
	 *	weight are hidden. Finally, the method calls a function that sorts the passes.
	 */
	applyFilters: function (interaction) {
		var baseWeight,
			filter,
			listWrapper = $('#list-wrapper'),
			checkedResorts = listWrapper.find('input:checked'),
			matchingSelections,
			selectedListItems,
			sliderValue,
			unmetWeight;

		/** the mobile slider is actually a dropdown menu, so the 10+ string should be converted to an integer */
		// TO DO: account for multiple number selection questions
		if (isMobile) {
			sliderValue = $('#number-wrapper').find('select').val();

			if (sliderValue === '10+') {
				sliderValue = 11;
			} else {
				sliderValue = parseInt(sliderValue);
			}
		} else {
			sliderValue = $('#slider').slider('value');
		}

		/** loop through each pass */
		$('.pass').each(function () {
			pass 		= $(this);
			baseWeight 	= parseInt(pass.attr('data-base-weight'));
			ruleCount 	= pass.attr('data-rules');

			/**
			 *	Loop through each rule, grabbing a count of (1) the number of conditions for each rule
			 *	and (2) the number of conditions not yet met. Also, grab the weight for each rule.
			 *	This weight is added to the pass' base weight if the conditionsLeft variable reaches 0.
			 */
			for (r = 1; r <= ruleCount; r++) {
				conditionCount 	= parseInt(pass.attr('data-total-conditions-for-rule-' + r));
				conditionsLeft 	= parseInt(pass.attr('data-conditions-unmet-for-rule-' + r));
				weight 			= parseInt(pass.attr('data-rule-' + r + '-weight'));
				unmetWeight 	= 0;

				/** x */
				if (conditionsLeft === 0) {
					unmetWeight = weight;
				}

				/** if a pass has no conditions, skip the calculations */
				if (conditionCount === 0) {
					//pass.attr('data-weight', weight);
					break;
				}

				/**
				 *	Loop through each condition, grabbing the operator, question ID,
				 *	question type, and value for each condition. For example, if the
				 *	condition is "greater than 3 days", the values would be like so:
				 *
				 *	operator: 	GT (for "greater than")
				 *	question: 	2  (corresponds to question with ID 2 in the database)
				 *	type: 		N  (for "number")
				 *	value: 		3  (for "3" days)
				 */
				for (c = 1; c <= conditionCount; c++) {
					operator 	= pass.attr('data-rule-' + r + '-condition-' + c + '-operator');
					question 	= pass.attr('data-rule-' + r + '-condition-' + c + '-question');
					type 		= pass.attr('data-rule-' + r + '-condition-' + c + '-type');
					value 		= pass.attr('data-rule-' + r + '-condition-' + c + '-value');
					conditionsLeft = parseInt(pass.attr('data-conditions-unmet-for-rule-' + r));


					selectedListItems = [];

					switch (type) {
						/** check questions of type "list" */
						case 'L':
							/**
							 *	The condition requires that the user select a value in a predetermined list.
							 *	E.g., the condition specifies a resort list of 1,2, or 6.
							 */
							if (operator === 'IN') {
								/** create array of selected list items */
								checkedResorts.each(function () {
									selectedListItems.push($(this).val());
								});

								matchingSelections = 0;

								/** loop through each of the checkboxes the user selected */
								for (var i = 0; i < selectedListItems.length; i++) {
									/** match, e.g., "1" but not "11" or "12" */
									filter = RegExp("(^|\\D)" + selectedListItems[i] + "(\\D|$)");

									/** if the condition includes a resort the user selected */
									if (value.match(filter) !== null) {
										matchingSelections++;

										/**
										 *	If the condition is satisfied by one of multiple resorts being selected
										 *	(e.g., 1, 2, or 6), we should set a flag (in this case, a class) that
										 *	the script can check. If the class is present, the script knows the
										 *	condition was already met. I.e., if the user selects resort 1 (thus
										 *	satisfying the condition), a class of "satisfies-rule-X-condition-Y" is
										 *	added to the pass, and the unmet condition count is reduced by 1 (remember,
										 *	an unmet condition count of 0 indicates that the overall rule is satisfied).
										 *
										 *	If the user subsequently checks resort 2 (again satisfying the condition),
										 *	the unmet condition count is *not* again reduced by 1 because the pass
										 *	is flagged as already having that condition met.
										 */
										if (!pass.hasClass('satisfies-rule-' + r + '-condition-' + c)) {
											pass.addClass('satisfies-rule-' + r + '-condition-' + c);

											/** extra safeguard: prevent reducing the unmet condition count to below 0 */
											if (conditionsLeft > 0) {
												pass.attr('data-conditions-unmet-for-rule-' + r, conditionsLeft - 1);
												break;
											}
										}
									}
								};

								/**
								 *	This bit of code is essentially the mirror opposite of the above. It accounts
								 *	for when a user selects a resort that satisfies a condition, and then goes back
								 *	and unchecks all resorts that satisfy the condition. In that case, we want to 
								 *	increase the unmet condition count by 1, to indicate that the condition is
								 *	no longer being met.
								 */
								if (matchingSelections === 0 && pass.hasClass('satisfies-rule-' + r + '-condition-' + c)) {
									pass.removeClass('satisfies-rule-' + r + '-condition-' + c);
									pass.attr('data-conditions-unmet-for-rule-' + r, conditionsLeft + 1);
								}

							/**	the condition requires that the user select an exact value (e.g., selected resort EQUALS 3) */
							} else if (operator === 'EQ') {
								/**
								 *	Ensures that exactly one checkbox is selected, and that the checked box's
								 *	value matches the value of the condition.
								 *
								 *	If so, check for the existence of a flag (which would mean the user previously
								 *	satisfied this condition), and decrement the unmet condition count by 1.
								 *
								 *	If not, only increment the unmet condition count by 1 if the user previously
								 *	met the condition but no longer meets it (this would happen if the user checked
								 *	and then unchecked a box).
								 */
								if (checkedResorts.length == 1 && checkedResorts.val() == value) {
									if (!pass.hasClass('satisfies-rule-' + r + '-condition-' + c)) {
										pass.addClass('satisfies-rule-' + r + '-condition-' + c);
										if (conditionsLeft > 0) {
											pass.attr('data-conditions-unmet-for-rule-' + r, conditionsLeft - 1);
										}
									}
								} else {
									if (pass.hasClass('satisfies-rule-' + r + '-condition-' + c)) {
										pass.removeClass('satisfies-rule-' + r + '-condition-' + c);
										pass.attr('data-conditions-unmet-for-rule-' + r, conditionsLeft + 1);
									}
								}
							}
						break;

						/**
						 *	The condition requires that the user select a number that is
						 *	greater than, less than, or equal to a particular value.
						 */
						case 'N':
							
							/** if the condition requires the selected value be greater than a certain value */
							if (operator === 'GT') {

								/**
								 *	If the user did indeed choose a value greater than the required value,
								 *	make sure the condition hasn't already been met (by checking for a data-
								 *	attribute flag). Also, make sure the unmet condition count doesn't go
								 *	below 0.
								 */
								if (sliderValue > value) {
									if (conditionsLeft > 0 && !pass.attr('data-rule-' + r + '-condition-' + c + '-met')) {
										pass.attr('data-conditions-unmet-for-rule-' + r, conditionsLeft - 1);
										pass.attr('data-rule-' + r + '-condition-' + c + '-met', 'true');
									}

								/**
								 *	The user chose a value less than the required value - if the user had
								 *	previously met the condition, remove the flag and increment the unmet
								 *	condition count.
								 */
								} else {
									if (conditionsLeft < pass.attr('data-total-conditions-for-rule-' + r)) {
										if (pass.attr('data-rule-' + r + '-condition-' + c + '-met')) {
											pass.attr('data-conditions-unmet-for-rule-' + r, conditionsLeft + 1);
											pass.removeAttr('data-rule-' + r + '-condition-' + c + '-met');
										}
									}
								}

							/** if the condition requires the selected value be less than a certain value */
							} else if (operator === 'LT') {
								if (sliderValue < value) {
									if (conditionsLeft > 0 && !pass.attr('data-rule-' + r + '-condition-' + c + '-met')) {
										pass.attr('data-conditions-unmet-for-rule-' + r, conditionsLeft - 1);
										pass.attr('data-rule-' + r + '-condition-' + c + '-met', 'true');
									}
								} else {
									if (conditionsLeft < pass.attr('data-total-conditions-for-rule-' + r)) {
										if (pass.attr('data-rule-' + r + '-condition-' + c + '-met')) {
											pass.attr('data-conditions-unmet-for-rule-' + r, conditionsLeft + 1);
											pass.removeAttr('data-rule-' + r + '-condition-' + c + '-met');
										}
									}
								}

							/** if the condition requires the selected value be equal to a certain value */
							} else if (operator === 'EQ') {
								if (interaction == 'slid') {
									if (sliderValue === parseInt(value)) {
										if (conditionsLeft > 0) {
											pass.attr('data-conditions-unmet-for-rule-' + r, conditionsLeft - 1);
											pass.attr('data-equality-for-rule-' + r, sliderValue);
										}
									} else {
										if (pass.attr('data-equality-for-rule-' + r)) {
											pass.attr('data-conditions-unmet-for-rule-' + r, conditionsLeft + 1);
											pass.removeAttr('data-equality-for-rule-' + r);
										}
									}
								}
							}
						break;

						/** the condition requires that the user select a "yes" value for a yes/no question */
						case 'Y':
							/** presently, we only check for "equals" */
							if (operator === 'EQ') {
								var questionMatch = $('[data-question="' + question + '"]'),
									toggleUncheckedOnFirstFilter = pass.attr('data-rule-' + r + '-condition-' + c + '-toggle-unchecked-on-first-filter'),
									toggleIsYes = questionMatch.hasClass('yes');

								/**
								 *	Toggle questions are special in that they need to be checked before the user
								 *	interacts with them. E.g., some passes require that the "ski on holidays"
								 *	toggle be set to "no" (the default). When the toggle is first created on the page,
								 *	it is given a special data- attribute that indicates it has not yet been run
								 *	through this method.
								 */
								if (toggleUncheckedOnFirstFilter) {
									pass.removeAttr('data-rule-' + r + '-condition-' + c + '-toggle-unchecked-on-first-filter');

									/**
									 *	If the user chose "yes" and the condition required yes,
									 *	or if the user chose "no" and the condition required no
									 */
									if (value === 'Yes' && toggleIsYes || value === 'No' && !toggleIsYes) {
										if (conditionsLeft > 0) {
											pass.attr('data-conditions-unmet-for-rule-' + r, conditionsLeft - 1);
										}
									}

								/** the user manually interacted with the toggle switch */
								} else {
									if (interaction === 'toggled') {
										/**
										 *	Verify that we are tracking the proper toggle switch; i.e., if the
										 *	condition is only interested in question #3, we make sure the user
										 *	just interacted with question #3 before proceeding. This is to prevent
										 *	user interactions with any other toggle questions from incorrectly
										 *	applying filters.
										 */
										if (questionMatch.hasClass('check-toggle') && questionMatch.attr('data-question') == question) {

											if (value === 'Yes' && toggleIsYes || value === 'No' && !toggleIsYes) {
												if (conditionsLeft > 0) {
													pass.attr('data-conditions-unmet-for-rule-' + r, conditionsLeft - 1);
												}
											} else{ 
												pass.attr('data-conditions-unmet-for-rule-' + r, conditionsLeft + 1);
											}
										}
									}
								}
								
							}
						break;
					}
				}

				/**
				 *	After checking all conditions for this rule, if any of the unmet condition counts
				 *	are 0 (indicating all conditions for a rule - and thus the rule - are met), add a
				 *	flag to the pass indicating it satisfies the current rule, then add the rule's
				 *	"modifying weight" to the pass' base weight.
				 */
				if (pass.attr('data-conditions-unmet-for-rule-' + r) === '0') {

					if (!pass.hasClass('satisfies-rule-' + r)) {
						pass.addClass('satisfies-rule-' + r);
						pass.attr('data-weight', parseInt(pass.attr('data-weight')) + parseInt(weight));
					}

				/** Otherwise... */
				} else {
					if (unmetWeight != 0 ) {
						pass.attr('data-weight', pass.attr('data-weight') - unmetWeight);
						pass.removeClass('satisfies-rule-' + r)
					}
				}
			}
		});

		passfinder.sortPasses();
	},


	/**
	 *	Loads seasonal text into the DOM
	 */
	loadOptions: function () {
		var wrapper = $('aside');

		if (isMobile) {
			wrapper = $('#yesno-wrapper');
		}
		
		wrapper.append('<p id="seasonal-text">' + seasonalText + '</p>');
	},


	/**
	 *  Parses JSON string containing list of passes in the database
	 *  and inserts them into the DOM.
	 */
	loadPasses: function () {
		var c,
			conditionCount,
			pass,
			passes = JSON.parse(p),
			passCount = passes.length,
			passHTML = '',
			passesWrapper = $('#pass-list'),
			questions = JSON.parse(q),
			questionCount = questions.length,
			r,
			rule,
			ruleString,
			z;

		for (var i = 0; i < passCount; i++) {
			pass = passes[i];

			/** gather info from JSON object */
			passDescription		= pass.d;
			passHeaderImageAlt  = pass.ha;
			passHeaderImagePath = pass.hp;
			passID              = pass.i;
			passImageAlt        = pass.ia;
			passImagePath       = pass.ip;
			passName            = pass.n;
			passPrice			= pass.p,
			passRules           = pass.r;
			passShortDescr		= pass.s;
			passUrlOther        = pass.uo;
			passUrlRecommended  = pass.ur;
			passBaseWeight      = pass.w;

			passHTML = '<article class="pass" data-passname="' + passName + '" data-pev2="PassFinder:Widget:Accordion:' + passName + '"';

			/** parse rules object and assemble a string representation of each rule */
			for (r = 0; r < passRules.length; r++) {
				rule 			= passRules[r];
				ruleCount 		= parseInt(r + 1);
				ruleString 		= '';
				ruleWeight      = rule.w;
				ruleConditions  = rule.c;

				/** parse conditions */
				for (c = 0; c < ruleConditions.length; c++) {
					condition       = ruleConditions[c];
					conditionCount	= parseInt(c + 1);
					ruleOperator    = condition.op;
					ruleQuestion    = condition.q;
					ruleValue       = condition.val;
					questionKind 	= '';

					/** get question type from question ID */
					for (z = 0; z < questionCount; z++) {
						if (ruleQuestion === questions[z].i) {
							questionKind = questions[z].k;
							break;
						}
					};

					ruleString = ruleString + ' data-rule-' + ruleCount + '-condition-' + conditionCount + '-question="' + ruleQuestion + '" data-rule-' + ruleCount + '-condition-' + conditionCount + '-type="' + questionKind + '" data-rule-' + ruleCount + '-condition-' + conditionCount + '-operator="' + ruleOperator + '" data-rule-' + ruleCount + '-condition-' + conditionCount + '-value="' + ruleValue + '"';

					/** track if a question is toggled on page load */
					if (questionKind === 'Y') {
						ruleString += ' data-rule-' + ruleCount + '-condition-' + conditionCount + '-toggle-unchecked-on-first-filter="true"';
					}
				}

				/** add a data attribute tracking the conditions and weight affecting each pass */
				passHTML += ruleString + ' data-conditions-unmet-for-rule-' + ruleCount + '="' + rule.c.length + '" data-total-conditions-for-rule-' + ruleCount + '="' + rule.c.length + '" data-rule-' + ruleCount + '-weight="' + ruleWeight + '"';
			}

			/** assemble the HTML for each pass */
			passHTML += ' data-rules="' + passRules.length + '" data-weight="' + passBaseWeight + '" data-base-weight="' + passBaseWeight + '"><h2>' + passName + ' <img alt="' + passHeaderImageAlt + '" src="' + passHeaderImagePath + '"><span><span>$' + passPrice + '</span><a href="#">Learn More</a></span></h2>';
			passHTML += '<div><img alt="' + passImageAlt + '" src="' + passImagePath + '"><div class="clearfix"><h3>' + passShortDescr + '</h3>' + passDescription;
			passHTML += '<span class="price">$<span class="dollars">' + passPrice + '</span><span class="perdiem">$<span></span><small>/day</small></span></span><a class="buy" data-url-other="' + passUrlOther + '" data-url-recommended="' + passUrlRecommended + '" href="' + passUrlOther + '" target="_blank">Buy Now</a></div></div></article>';

			/** perform initial sort (on first page load) based on weight, descending */
			topPassWeight = $('#pass-list').find('article:first-child').attr('data-weight');

			if (passBaseWeight > topPassWeight) {
				passesWrapper.prepend(passHTML);
			} else {
				passesWrapper.append(passHTML);
			}

			/** store the daily price for the regular lift ticket in a data- attribute */
			if (passName === 'Daily Lift Ticket') {
				$('[data-passname="Daily Lift Ticket"]').find('.dollars').attr('data-daily-price', passPrice);
			}
		};

		/** insert subtitle after recommended pass */
		passesWrapper.find('article:first-child').addClass('open').after('<h2>Additional Pass Results</h2>');
	},


	/**
	 *  Parse JSON string containing list of questions in the database
	 *  and output them in the DOM.
	 */
	loadQuestions: function () {
		var question,
			questions = JSON.parse(q),
			questionCount = questions.length;

		for (var i = 0; i < questionCount; i++) {
			question 		= questions[i];
			questionId 		= question.i;
			questionKind 	= question.k;
			questionTitle 	= question.t;
			questionPev2 	= question.p;

			/** question is of type "list"; only change the title (assume that for now we only have one list) */
			if (questionKind === 'L') {
				$('.choose-resort').text(questionTitle);
				$('#list-wrapper').attr('data-pev2', questionPev2);

				/** fade in main screen menu once question title is in place (prevents the first button from sometimes loading late) */
				if (isMobile) {
					$('menu').fadeIn();
				}
			
			/** question is of type "number"; append a slider */
			} else if (questionKind === 'N') {
				if (isMobile) {
					selectHTML = '<select><option selected="1" value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="10+">&gt;10</option></select>';
					$('#number-wrapper').append('<div class="question clearfix" data-pev2="' + questionPev2 + '"><p>' + questionTitle + '</p>' + selectHTML + '<span class="day-count">Day</span></div>');
				} else {
					$('#number-wrapper > div').append('<div class="question clearfix" data-pev2="' + questionPev2 + '"><p>' + questionTitle + '</p><div id="slider"></div><div id="day-count"><p></p><span></span></div></div>');
				}
			
			/** question is of type "yes/no"; append a switch */
			} else if (questionKind === 'Y') {
				if (isMobile) {
					$('#yesno-wrapper').append('<div class="question clearfix" data-pev2="' + questionPev2 + '" data-question="' + questionId + '"><p>' + questionTitle + '</p><div class="toggle"><div class="toggle-inner"><span>Yes</span><span class="switch"></span><span>No</span></div></div></div>');
				} else {
					$('#yesno-wrapper > div').append('<div class="question clearfix" data-pev2="' + questionPev2 + '" data-question="' + questionId + '"><p>' + questionTitle + '</p><div class="toggle"><div class="toggle-inner"><span>Yes</span><span class="switch"></span><span>No</span></div></div></div>');
				}
			}
		};
	},


	/**
	 *  Parses JSON string containing list of resorts in the database
	 *  and outputs them as a selectable HTML list.
	 */
	loadResorts: function () {
		var resort,
			resorts 		= JSON.parse(r),
			resortCount 	= resorts.length,
			resortGroup,
			resortGroupSlug = '',
			resortHTML 		= '',
			listWrapper 	= $('#list-wrapper');

		for (var i = 0; i < resortCount; i++) {
			resort 			= resorts[i];
			resortImageAlt 	= resort.a;
			resortIcon 		= resort.f;
			resortGroupName = resort.g;
			resortID 		= resort.i;
			resortName 		= resort.n;
			resortQuestions = resort.q;

			/** convert resort name to URL friendly slug */
			resortGroupSlug = resortGroupName.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

			/** move each resort into the appropriate group in the DOM */
			resortGroup = listWrapper.find('fieldset[data-group="' + resortGroupSlug + '"]').find('.scrollbox div');

			if (resortGroup.length) {
				resortGroup.append('<label><input data-questions="' + resortQuestions + '" name="' + resortName + '" type="checkbox" value="' + resortID + '"><img alt="' + resortImageAlt + '" src="' + resortIcon + '"> ' + resortName + '</label>');
			} else {
				listWrapper.append('<fieldset class="clearfix" data-group="' + resortGroupSlug + '"><legend>' + resortGroupName + '</legend><div class="scrollbox"><div><label><input data-questions="' + resortQuestions + '" name="' + resortName + '" type="checkbox" value="' + resortID + '"><img alt="' + resortImageAlt + '" src="' + resortIcon + '"> ' + resortName + '</label></div></div></fieldset>');
			}
		};

		/** check all resorts to see if any yes/no questions have dependencies; if so, hide them */
		listWrapper.find('input').each(function () {
			$('#yesno-wrapper').find('[data-question="' + $(this).attr('data-questions') + '"]').hide();
		});
	},


	/**
	 *	Clears out all passes and reloads them.
	 */
	resetPasses: function (interaction) {
		var passWrapper = $('#pass-list'),
			sliderValue = $('#day-count').find('p').text();

		if (isMobile) {
			sliderValue = $('#number-wrapper').find('select').val();
		}

		/** hide pass options while they are being emptied and sorted */
		passWrapper.fadeOut(500, function () {
			passWrapper.empty();
			passfinder.loadPasses();
			passfinder.applyFilters(interaction);

			/** set per diem pass prices (initial page load) */
			$('.pass').each(function () {
				passPrice = $(this).find('.dollars').text();

				if (sliderValue === '10+') {
					$(this).find('.perdiem').html('Less than $<span>' + Math.round(passPrice / 11) + '</span><small>/day</small>');
				} else {
					$(this).find('.perdiem span').text(Math.round(passPrice / sliderValue));
				}
			});
		});
	},


	/**
	 *	Custom scrollbar
	 */
	scrollbar: function () {
		$('.scrollbox').perfectScrollbar();
	},


	/**
	 *	Sorts passes after a user interacts with a filter
	 */
	sortPasses: function () {
		var buyButton,
			clone,
			pass = $('.pass'),
			passWrapper = $('#pass-list'),
			passFeatured,
			sortedPasses,
			topPassWeight;

		pass.removeClass('ineligible').show();

		/** clone then remove subtitle so it doesn't interfere with sorting */
		passSubtitle = passWrapper.find('> h2').clone();
		passWrapper.find('> h2').remove();

		pass.each(function () {
			/** update buy URL */
			buyButton = $(this).find('.buy');
			buyButton.attr('href', buyButton.attr('data-url-other'));

			/** hide passes with negative weight */
			if ($(this).attr('data-weight') < 0) {
				$(this).addClass('ineligible').hide();
			}
		});

		/** collapse all passes */
		pass.removeClass('open');
		pass.find('> div').hide();
			
		/** sort passes by weight */
		sortedPasses = passWrapper.find('.pass').toArray().sort(passSorter);
	    $.each(sortedPasses, function (index, value) {
	        passWrapper.append(value);
	    });

	    function passSorter(a, b) {
		    return b.getAttribute('data-weight') - a.getAttribute('data-weight');
		};

		/** reinsert subtitle */
		passWrapper.find('article:first-child').after(passSubtitle);
		passSubtitle.show();

		/** expand recommended pass */
		passWrapper.find('article:first-child').addClass('open');
		passWrapper.find('article:first-child > div').show();

		/** update recommended pass URL */
		recommendedURL = passWrapper.find('article:first-child').find('.buy').attr('data-url-recommended');
		passWrapper.find('article:first-child').find('.buy').attr('href', recommendedURL);

		/** if there is only one matching pass, hide "Additional Pass Options" subtitle */
		if (pass.not('.ineligible').length === 1) {
			passWrapper.find('> h2').hide();
		}

		if (!isMobile) {
			$('.loading').fadeOut(500);
			passWrapper.fadeIn(500);
		}
	},


	/**
	 *  Handle clicks on yes/no toggle buttons, and filter passes accordingly.
	 *	The "check-toggle" class allows us to track which toggle element the
	 *	user just interacted with; allows for proper filtering of passes in the
	 *	applyFilters method.
	 */
	toggle: function () {
		var toggleValue,
			toggleWrapper;

		function triggerToggle (element) {
			toggleWrapper = element.closest('.question');
			toggleWrapper.toggleClass('yes');
			toggleWrapper.addClass('check-toggle');

			/** fire Omniture event */
			if (toggleWrapper.hasClass('yes')) {
				toggleValue = 'Yes';
			} else {
				toggleValue = 'No';
			}

			/** fire Omniture event */
			s.tl(this, 'o', toggleWrapper.attr('data-pev2') + ':' + toggleValue);

			passfinder.resetPasses('toggled');
			toggleWrapper.removeClass('check-toggle');
		}

		/**
		 *	Toggle elements should be swipe-able on mobile.
		 *	Desktop users can just click.
		 */
		if (isMobile) {
			$('.toggle').swipe({
				/** generic swipe handler for all directions */
				swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
					triggerToggle($(this));
				},
				/** default is 75px - set to 0 so any distance triggers */
				threshold: 0
			});
		} else {
			$('main').on('click', '.toggle', function () {
				triggerToggle($(this));
			});
		}
	}
};