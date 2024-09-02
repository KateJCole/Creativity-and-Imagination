!function() {
	var platform = dkiUA.getUAProperties().platform;
	var pinnedMenu = false;
	var dom = {
		nav: null,
		menu: null,
		outline: null,
		search: null,
		narration: null,
		transcript: null,
		transcript_menu: null,
		transcript_body: null,
		submit: null
	};
	
	var current = {
		page: null,
		section: null
	};
	
	var config = {};
	var getMaxWidth = function(){
		return config.design.parameters.config ? config.design.parameters.config.constrainCourseWidth : false;
	};
	var GetMaxWidthVal = function(){
		return config.settings.course ? config.settings.course.parameters.maxWidth : false;
	}
	var GetMaxHeightVal = function() {
		return config.settings.course ? config.settings.course.height : false;
	}
	var getContentMargin = function(side){
		return parseFloat($("#contentFrame").css("margin-" + side).split("px")[0]) + parseFloat($(".bgRepeater").css("margin-" + side).split("px")[0]);
	}
	var templates = {
		navigation: "",
		menu: 
		'<nav id="left_menu" class=\"navmenu navmenu-default navmenu-fixed-left offcanvas canvas-slid in\">' +
			'<ul class=\"nav navmenu-nav\">' +	
				'<li id="navmenu_x_wrapper" class=\"clearfix\">' +
					'<a id="navmenu_x" aria-label=\"{{strings.runtime.buttonLabelClose}}\" href=\"javascript:;\" style=\"display:inline-block\" class="navmenu-link navmenu-submenu-link pull-right" tabindex="-1">' +
						'<i class=\"fa fa-times menu-icon\"></i>' +
					'</a>' +
				'</li>' +
				'<li id="navmenu_search_wrapper">' +
					'<div class="input-group menuSearch">' +
						'<div class="input-group-addon"><i class="fa fa-search"></i></div>' +
						'<input id="navmenu_search" type="text" class="form-control" placeholder="{{strings.courseSearch.inputPlaceholder}}" tabindex="-1" aria-label="{{strings.courseSearch.inputPlaceholder}}" />' +
					'</div>' +
				'</li>' +
				"{{#each custom}}" + 
					'<li id="navmenu_custom{{@index}}_wrapper">' +
					'<a id="{{this.id}}" {{#if this.url}}target=\"_customMenu\"{{/if}} class="navmenu-link navmenu-submenu-link custom ignore_enter {{#ifEq this.openIn \'lightbox\'}}open-in-modal{{/ifEq}}" href="{{#if this.url}}{{this.url}}{{else}}javascript:;{{/if}}" data-target="" tabindex="-1" aria-label="{{this.label}}">' +
						'<i class=\"fa {{this.icon}} menu-icon\"></i>{{this.label}}</i>' +
					'</a>' +
				'</li>' +
				"{{/each}}" +
				'<li id="navmenu_outline_wrapper">' +
					'<a id="navmenu_outline" href=\"#\" class="navmenu-link navmenu-submenu-link" data-target="#dki_course_outline" tabindex="-1" aria-label="{{strings.index.outlineTabLabel}}">' +
						'<i class=\"fa fa-sitemap menu-icon\"></i>{{strings.index.outlineTabLabel}}<i class=\"fa fa-chevron-right pull-right\"></i>' +
					'</a>' +
				'</li>' +
				'<li id="navmenu_glossary_wrapper">' +
					'<a id="navmenu_glossary" href=\"#\" class="navmenu-link navmenu-submenu-link" data-target="#dki_glossary_list" tabindex="-1" aria-label="{{strings.index.glossaryButtonLabel}}">' +
						'<i class=\"fa fa-list-ul menu-icon\"></i>{{strings.index.glossaryButtonLabel}}<i class=\"fa fa-chevron-right pull-right\"></i>' +
					'</a>' +
				'</li>' +
				'<li id="navmenu_resource_wrapper">' +
					'<a id="navmenu_resource" href=\"#\" class="navmenu-link navmenu-submenu-link" data-target="#dki_resource_list" tabindex="-1" aria-label="{{strings.index.resourcesButtonLabel}}">' +
						'<i class=\"fa fa-file-o menu-icon\"></i>{{strings.index.resourcesButtonLabel}}<i class=\"fa fa-chevron-right pull-right\"></i>' +
					'</a>' +
				'</li>' +
				'<li id="navmenu_bibliography_wrapper"><a id=\"bibliographyButton\" href=\"#\" class="navmenu-link" tabindex="-1" aria-label="{{strings.references.bibliographyWindowTitle}}"><i class=\"fa fa-file-text-o menu-icon\"></i>{{strings.references.bibliographyWindowTitle}}</a></li>' +
				'<li id="navmenu_replay_wrapper"><a id=\"replayButton\" href=\"#\" class="navmenu-link" tabindex="-1" aria-label="{{strings.index.replayButtonLabel}}"><i class=\"fa fa-refresh menu-icon\"></i>{{strings.index.replayButtonLabel}}</a></li>' +				
				'<li id="navmenu_exit_wrapper"><a id=\"exitButton\" href=\"#\" class="navmenu-link" tabindex="-1" aria-label="{{strings.index.exitButtonLabel}}"><i class=\"fa fa-close menu-icon\"></i>{{strings.index.exitButtonLabel}}</a></li>' +
			'</ul>' +	
		'</nav>',
		"menu_outline":
		'<nav id="dki_course_outline" class="navmenu navmenu-default navmenu-submenu-container">' +					
			'<ul class="nav navmenu-nav navmenu-submenu-back">' +				
				'<li>' +			
					'<a href="#" class="navmenu-link" tabindex="1"><i class=\"fa fa-chevron-left pull-left\"></i>{{@root.strings.courseSearch.back}}</a>' +
				'</li>'	+				
			'</ul>' +
			'{{{dki_course_outline className="navmenu-submenu"}}}' +
		'</nav>',
		"menu_glossary":
		'<nav id="dki_glossary_list" class="navmenu navmenu-default navmenu-submenu-container">' +					
			'<ul class="nav navmenu-nav navmenu-submenu-back">' +				
				'<li>' +			
					'<a href="#" class="navmenu-link" tabindex="1"><i class=\"fa fa-chevron-left pull-left\"></i>{{@root.strings.courseSearch.back}}</a>' +
				'</li>'	+				
			'</ul>' +
			'{{{DKI_templates_glossary_list className="navmenu-submenu"}}}' +
		'</nav>',
		menu_resource:
		'<nav id="dki_resource_list" class="navmenu navmenu-default navmenu-submenu-container">' +					
			'<ul class="nav navmenu-nav navmenu-submenu-back">' +				
				'<li>' +			
					'<a href="#" class="navmenu-link" tabindex="1"><i class=\"fa fa-chevron-left pull-left\"></i>{{@root.strings.courseSearch.back}}</a>' +
				'</li>'	+				
			'</ul>' +
			'{{{DKI_templates_resource_list className="navmenu-submenu"}}}' +
		'</nav>',
		transcript: 
		'<div id="transcript_menu" class=\"navmenu navmenu-default navmenu-fixed-left\">' +
			'<div>' +	
				'<div class=\"navmenu-header\">' +
					'<p class=\"navmenu-brand\" href=\"#\">{{strings.index.transcriptButtonLabel}}<a tabindex=\"1\" class=\"xbutton pull-right navmenu-text\" aria-label=\"{{strings.runtime.buttonLabelClose}}\" href=\"javascript:;\"><i class=\"fa fa-times\"></i></a></p>' +
				'</div>' +
				'<div class=\"container-fluid\">' +
					'<ul class=\"nav navmenu-nav\">' +	
						'<li>' +
							'<p id="transcript_body" class="navmenu-text" tabindex="1">' +								
							'</p>' +
						'</li>' +						
					'</ul>' +									
				'</div>' +
			'</div>' +				
		'</div>',
		page_navigator: 		
		'<nav id="page_navigator" class=\"navbar navbar-inverse navbar-fixed-top dki-course-max-width\">' +
			'<div class=\"container-fluid\">' +					
				'<ul class="nav navbar-nav">' +				
					'<li class="back-to-top">' +			
						'<a class="navbar-link"><i class=\"fa fa-arrow-up\"></i> Top</a>' +
					'</li>'	+						
				'</ul>' +
				'<ul class="nav navbar-nav navbar-right">' +							
					
					'<li>' +			
						'<a id=\"upSection\" class="navbar-link"><i class=\"fa fa-chevron-up\"></i></a>' +	
					'</li>'	+	
					'<li>' +	
						'<a id=\"downSection\" class="navbar-link"><i class=\"fa fa-chevron-down\"></i></a>' +
					'</li>'	+

					'<li class="dropdown">' +
						'<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' +
						'<span id="sectionCount" tabindex="0"><span id="currentSection">0</span> / <span id="totalSections">0</span></span>' +
						'</a>' +
						'<ul id="sectionDropdown" class="dropdown-menu">' +							
						'</ul>' +
					'</li>' +						
				'</ul>' +								
			'</div>' +	
		'</nav>'
	};
	var skipMenuFocus = true;
	var menuWidth = 300;
	var toggleMenu = function(toShow){
		show = typeof toShow === "undefined" ? !dom.menu.hasClass("toggled") : toShow;
		var width = show ? menuWidth : 0,
			cfg = {};
		cfg.width = width;
		show ? dom.menu.show().trigger("show.bs.offcanvas") : dom.menu.trigger("hide.bs.offcanvas");
		dom.menu.velocity(DKI.clone(cfg), {
			duration: 350,
			complete: function(){
				if(show) {
					$(theme).trigger(theme.events.menuOpened);
					dom.menu.trigger("shown.bs.offcanvas").addClass("toggled");
				}else{
					dom.menu.hide().trigger("hidden.bs.offcanvas").removeClass("toggled");
					skipMenuFocus = true;
				}	
			}
		});
	}
	
	var buildDom = function(){
		
		var pinnedChecker = $("<div id=\"pinned_checker\"></div>");	
		$("html").append(pinnedChecker);
		if($("html").hasClass("responsive") && pinnedChecker.css("display") == "block"){
			pinnedMenu = true;
		}
		pinnedChecker.remove();
		templates.navigation = config.design.parameters.editor.templates.top_nav_bar;
		dom.nav = $(Handlebars.compile(templates.navigation)({
			strings: DKI.strings,
			course : typeof dataStorage != "undefined" ? dataStorage.courseStructure : {}
		}));
		var maxWidth = getMaxWidth();
		if(maxWidth){
			dom.nav.addClass("dki-course-max-width").css("margin","0 auto");
		}
		if(dkiUA.mobile) {
			dom.nav.css("max-width",$(window).width());	
		}
		var custom = [];
		if(config.design.parameters.config){
			var items = config.design.parameters.config.menuItems,
				keys = [];
			for (k in items) {
			  if (items.hasOwnProperty(k)) {
			    keys.push(k);
			  }
			}
			keys.sort();
			$.each(keys,function(o,i){
				if(!items[this].disabled){
					var item = items[this];
					//If it's not a good link, then we'll set it to empty so it'll be ignored in rendering
					item.url = item.url && (/(http|https):\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/).test(item.url) ? item.url : ""; 
					custom.push(item);
				}
			});
			
		}
		dom.menu = $(Handlebars.compile(templates.menu)({			
			strings: DKI.strings,
			custom : custom
		}));
		dom.outline = $(Handlebars.compile(templates.menu_outline)({			
			strings: DKI.strings
		}))
		if(!pinnedMenu){
			dom.menu.append(dom.outline);
		}
		dom.menu.append($(Handlebars.compile(templates.menu_glossary)({			
			strings: DKI.strings
		})));
		dom.menu.append($(Handlebars.compile(templates.menu_resource)({			
			strings: DKI.strings
		})));
		dom.transcript_menu = $(Handlebars.compile(templates.transcript)({			
			strings: DKI.strings
		}));
		dom.page_navigator = $(Handlebars.compile(templates.page_navigator)({			
			strings: DKI.strings
		}));
		var a = config;

		dom.search = dom.menu.find("#navmenu_search");		
		dom.narration = dom.nav.find("#navbar_narration");
		dom.mute = dom.nav.find("#navbar_mute");
		dom.module = dom.nav.find("#navbar_module_title");
		dom.transcript = dom.nav.find("#navbar_transcript");
		dom.menu_button = dom.nav.find("#navbar_menu");
		dom.transcript_body = dom.transcript_menu.find("#transcript_body");
		dom.submit = dom.nav.find("#navbar_submit");
		dom.x = dom.menu.find("#navmenu_x");
		dom.close = dom.nav.find("#navbar_close");
		dom.transcriptX = dom.transcript_menu.find("a.xbutton");
		dom.cc = dom.nav.find("#navbar_audio_cc");
		if(!$("html").hasClass("noNav")){
			if(pinnedMenu){
				$("body").addClass("pinned-menu").prepend([dom.nav, dom.transcript_menu, dom.menu, dom.outline]);
			}
			else{
				$("body").prepend([dom.nav, dom.transcript_menu, dom.menu]);
			}
		}
		if(dom.menu_button.data("orientation") == "right"){
			dom.menu.addClass("navmenu-fixed-right").removeClass("navmenu-fixed-left");
			dom.transcript_menu.addClass("navmenu-fixed-right").removeClass("navmenu-fixed-left");
			$("html").addClass("fixed-right");
		}
		dom.menu_button.on("click",function(){
			toggleMenu();
		});
		

		if(maxWidth && !dkiUA.mobile) {
			dom.menu.css("max-height", GetMaxHeightVal());
			dom.transcript_menu.css("max-height", GetMaxHeightVal());
		}

		//push body down as navbar in this theme is fixed.
		$("body").css("padding-top", dom.nav.outerHeight());	
		dom.page_navigator.css("top", dom.nav.outerHeight());
		if(pinnedMenu){
			dom.outline.css("top", dom.nav.outerHeight());
		}
		//$(".bgRepeater").css("padding-top", dom.page_navigator.outerHeight());	
		
		dom.sectionDropdown = dom.page_navigator.find("#sectionDropdown");
		dom.currentSection = dom.page_navigator.find("#currentSection");
		dom.totalSections = dom.page_navigator.find("#totalSections");
		
		if(DKI.resourceBrowser && !DKI.resourceBrowser.hasResources()){
			dom.menu.find("#navmenu_resource").disable();
		}
		if(DKI.glossaryBrowse && DKI.glossaryBrowse.getTerms().length == 0){
			dom.menu.find("#navmenu_glossary").disable();
		}
		if(DKI.references && DKI.references.lastOrder == 0){
			dom.menu.find("#bibliographyButton").disable();
		}

		$(".learning-completion-progress").removeAttr('aria-valuenow').removeAttr('aria-valuemin').removeAttr('aria-valuemax');
		
	};
	


	var initEvents = function(){
		dom.cc.on(config.settings.clickEvent, function(){
			if($(this).hasClass('disabled-element')){
				return false;
			}
			$("html").toggleClass("showAudioCaptions");
		})
		dom.narration.on(config.settings.clickEvent, function(){
			if(!dom.narration.hasClass("disabled") && dom.narration.hasClass("toggled")){
				$(".dkiContentFrame.current .dki-authoring-element[data-narration=1] .dki-element-content").jPlayer("pause");
			}
			else{
				$(".dkiContentFrame.current .dki-authoring-element[data-narration=1] .dki-element-content").jPlayer("play");	
			}
		});

		

		dom.mute.on('click', function(event) {

			event.stopPropagation();
			if (!$(this).hasClass("disabled")) {
				if (player.navigation.audioState === "on") {
					player.navigation.audioState = "off";
				}
				else {
					player.navigation.audioState = "on";
				}
				dom.mute.toggleClass('toggled');
				$(player.navigation).trigger(DKI.PlayerNavigation.events.audioToggle, [player.navigation.audioState]);
				player.navigation.hideMore();
			}

			return false;

		});
		if(!player.isSinglePage){
			$(player).on(player.events.pageLoaded, function() {
				dom.module.html(config.contentAPI.getCurrentModuleName());
			});
		}

		
		dom.transcript.on(config.settings.clickEvent, function(){
			if(!dom.transcript.isDisabled()){
				var o = $("#transcript_menu").hasClass("navmenu-fixed-left") ? "left" : "right";
				if(!dom.transcript.hasClass("toggled") || dom.menu.hasClass("toggled")){
					
					$("#transcript_menu").css("display", "block");
					$("#transcript_menu").css("width", 0);
					var bgRepeaterX = getMaxWidth() && $(window).width() > GetMaxWidthVal() ? 0 : menuWidth - getContentMargin("left");
					dom.menu.css("z-index", "");
					$("#transcript_menu").css("display", "block");
					dom.transcript_body.focus({preventScroll: true}); //Doesn't work with IE 11, known issue
					var cfg = {
						width : menuWidth
					};
					var cfMargin = getContentMargin("left") + "px";
					var props = {
						"z-index": "1030"
					};
					if(getMaxWidth()){
						if(dom.menu.hasClass("navmenu-fixed-left")){
							props["margin-left"] = cfMargin;
						}
						else{
							props["margin-right"] = cfMargin;
						}
					}
					$("#transcript_menu").css(props).velocity(DKI.clone(cfg), {
						duration: 350,
						complete: function(){
							toggleMenu(false);						
						}
					});

					dom.transcript.addClass("toggled");
					$(theme).trigger(theme.events.themeTranscriptShown);
				}
				else{
					var cfg = {
						width: 0
					};
					$("#transcript_menu").velocity(DKI.clone(cfg), {
						duration: 350, 
						complete: function(){
							$("#transcript_menu").css("z-index", "");
							$("#transcript_menu").css("display", "");
						}
					});
					dom.transcript.removeClass("toggled");
				}
			}
		});
		dom.transcriptX.on(config.settings.clickEvent,function(){
			dom.transcript.trigger(settings.clickEvent);
			dom.transcript[0].focus();
		})

		if(dom.close){
			dom.close.on(config.settings.clickEvent,function(){
				contentApi.exitCourse();
			});
		}
		//when the menu hides, need to hide all submenus
		dom.menu.on("hidden.bs.offcanvas", function(){
			dom.menu.find(".navmenu").velocity({
				translateX: 0
			}, 0).css("display", "");
			dom.search.val("");
			dom.menu.css("z-index", "");
			if(!skipMenuFocus){
				dom.menu_button[0].focus();
			}
			dom.menu.removeClass("toggled");
		});
		dom.menu.on("show.bs.offcanvas", function(){
			var margin = getContentMargin("left") + "px";
			var props = {
				"z-index": "1030"
			};
			if(getMaxWidth()){
				if(dom.menu.hasClass("navmenu-fixed-left")){
					props["margin-left"] = margin;
				}
				else{
					props["margin-right"] = margin;
				}
			}
			dom.menu.css(props);
			$("#transcript_menu").css("z-index", "");
		});
		/*When the menu is opened, focus is shifted to the search input. 
		* When it is closed, focus is given to the element that was interacted with to close the menu.
		* On focusin/out the input has css transitions that run and will fire this event. 
		* It will bubble up to the menu and mess offcanvas widget, so we stop propagation right here.
		*/
		dom.menu.on("webkitTransitionEnd","input",function(){
			return false;
		});
		dom.menu.on("shown.bs.offcanvas", function(){
			// bit of a hack: need to set the tabindex for menu items to 0 befofe they get shown the first time so that we can't tab to them while they're hidden
			dom.menu.find("a.navmenu-link[tabindex='-1'],input[tabindex='-1']").attr('tabindex', '1');

			dom.menu.find("*[tabindex][tabindex!='-1']").each(function(){
				if($(this).is(":visible") && !$(this).hasClass("disabled-element")){
					this.focus();
					return false;
				}
			});

			dom.menu.addClass("toggled");
		});

		//when you click a submenu link, show the target
		dom.menu.on(config.settings.clickEvent, ".navmenu-submenu-link", function(e){
			var target = $($(this).data("target"));
			var current = target.find(".current");
			var scrollParent = current.scrollParent();
			target.css("display", "block");
			//if it has a back link, offset it.
			var backHeight = target.find(".navmenu-submenu-back").outerHeight();
			target.find(".navmenu-submenu").css({"top": backHeight, "height": "calc(100% - " + backHeight + "px)"});			
			target.velocity({
				translateX: "-100%"
			}, function(){
				if(current.length > 0){
					current.focus();
				}
				else{
					var possibleTabTargets = target.find("*[tabindex][tabindex!='-1']:not(.navmenu-link)");
					if(possibleTabTargets.length == 0){
						possibleTabTargets = target.find("*[tabindex][tabindex!='-1']");
					}
					possibleTabTargets.each(function(){
						if($(this).is(":visible") && !$(this).hasClass("disabled-element")){
							this.focus();
							return false;
						}
					});
				}
			});
		});		
		dom.menu.on(config.settings.clickEvent, ".navmenu-submenu-back a", function(e){
			var target = $(this);
			dom.menu.find(".navmenu").velocity({
				translateX: 0
			}, function(){			
				dom.menu.find(".navmenu").css("display", "");				
				$("*[data-target='#" + target.closest(".navmenu-submenu-container").attr("id") + "']").focus();
			});
		});

		dom.search.on("keypress", function(e){
			if(e.which == 13){
				config.contentAPI.showCourseSearch(this.value);
			}
		});

		dom.submit.on(config.settings.clickEvent, function(){
			contentApi.submitQuestion();
		});

		dom.page_navigator.on(settings.clickEvent, ".back-to-top a", function(){
			contentApi.backToTop();
			return false;
		});

		dom.page_navigator.on(settings.clickEvent, "#upSection", function(){
			current.section.prev().velocity("scroll", {
				offset: -$("#contentFrame").offset().top
			});
			return false;
		});
		dom.page_navigator.on(settings.clickEvent, "#downSection", function(){
			current.section.next().velocity("scroll", {
				offset: -$("#contentFrame").offset().top
			});
			return false;
		});
		dom.x.on(settings.clickEvent,function(){
			skipMenuFocus = false;
			toggleMenu(false);
		});
		$("*").on(settings.clickEvent, function(e){
			if(dom.menu.hasClass("toggled") && $(e.target).closest("#left_menu").length == 0 && $(e.target).closest("#navbar_menu").length == 0){
				skipMenuFocus = false;
				toggleMenu(false);
			}
		});
		if(DKI.outline){
			$(document).on(DKI.outline.events.pageSelected,function(){
				skipMenuFocus = false;
			});
		}
		$(document).on(DKI.EndModule.events.started, function(e){
			toggleMenu(false);
		});
		$(document).on(DKI.ContentPage.events.started, function(e, page){			
			current.page = page;
			var total = 0;
			$(".dki-authoring-section", page.pageContainer).each(function(){
				var section = $(this);
				total ++;
				section.data("section-index", total);
				section.waypoint(DKI.apply(DKI.ContentPage.waypointDefaults, {
					handler: function(direction){
						if(direction == "down"){
							dom.currentSection.html(section.data("section-index"));
							current.section = section;
						}
						else{
							dom.currentSection.html(section.prev().data("section-index"));	
							current.section = section.prev();
						}						
						if(current.section.data("section-index") == 1){
							dom.page_navigator.find("#upSection").disable();
						}
						else{
							dom.page_navigator.find("#upSection").enable();	
						}
						if(current.section.data("section-index") == $(".dki-authoring-section", page.pageContainer).length){
							dom.page_navigator.find("#downSection").disable();
						}
						else{
							dom.page_navigator.find("#downSection").enable();	
						}
						dom.sectionDropdown.find("li.active").removeClass("active");
						dom.sectionDropdown.find("li[data-target='" + current.section.attr("id") + "']").addClass("active")
					},
					offset: $("#contentFrame").offset().top +5
				}));
				var title = section.find(".header-text").text();
				if(title == ""){
					title = "Untitled Section";
				}
				var sectionClass = "";
				if(total == 1){
					sectionClass = "active";
				}
				dom.sectionDropdown.append("<li class='" + sectionClass + "' data-target='" + section.attr("id") + "'><a href='#'>" + title + "</a></li>");
			});
			dom.totalSections.html(total);
			dom.sectionDropdown.on(settings.clickEvent, "li", function(){
				$("#" + $(this).data("target")).velocity("scroll", {
					offset: -$("#contentFrame").offset().top
				});
				dom.sectionDropdown.closest("li").removeClass("open");
			});

			// use setTimeout to ensure the current page has a chance to get marked as complete
			setTimeout(function(){
				//set progress bar
				var value = config.contentAPI.getCourseCompletion();
				$(".learning-completion-progress").css('width', value+'%');
				$(".learning-completion-value").html(value);
			}, 10);


			toggleMenu(false);

			var narrationElements = $(".dkiContentFrame.current .dki-authoring-element[data-narration=1]");
			if(narrationElements.length > 0){
				dom.narration.enable();
				$(narrationElements).on($.jPlayer.event.play, function(event){					
					if($(this).closest('.dkiContentFrame.current').length){
						dom.narration.addClass("toggled");
					}
				});
				$(narrationElements).on($.jPlayer.event.pause, function(event){
					if($(this).closest('.dkiContentFrame.current').length){
						dom.narration.removeClass("toggled");
					}
				});
				if(narrationElements.find(".jp-audio.cc").length){
					dom.cc.enable();
				}
				else{
					dom.cc.disable();
				}
			}
			else{
				dom.cc.disable();
				dom.narration.disable();
				dom.narration.removeClass("toggled");
			}

			if(current.page.page.transcript){
				dom.transcript.enable();
				dom.transcript_body.html(current.page.page.transcript.body);
			}
			else{
				if(dom.transcript.hasClass("toggled")){
					dom.transcript.trigger(settings.clickEvent);
				}
				dom.transcript.disable();
				dom.transcript_body.html("");				
			}

			dom.transcript_menu.find(">div").scrollTop(0);

			/*
			var elementWrapper = $(".pageElementsWrapper", page.pageContainer);
			$(".bgRepeater").css({
				"background-image": "url('" + elementWrapper.data("background-url") + "')",
				"background-repeat": elementWrapper.css("background-repeat"),
				"background-attachment": elementWrapper.css("background-attachment"),
				"background-position": elementWrapper.css("background-position"),
				"background-size": elementWrapper.css("background-size")
			}).removeClass($(".bgRepeater").data("currentAnimation")).addClass(page.page.parameters.background.animation).data("currentAnimation", page.page.parameters.background.animation);
			*/
		});


		var zoomToFit = false;
		if(!this.settings.responsive){
			var zoomCheck = $("<div/>", {"class": "zoomToFitChecker"});
			$("body").append(zoomCheck);
			zoomToFit = zoomCheck.css("display") != "none";
			zoomCheck.remove();
		}

	
		//using win resize here as the height of the nav changes across BPs
		var handleResize = function(){
			if(zoomToFit){
				var ratio;
				var courseWidth = settings.course.width;
				var courseHeight = settings.course.height + dom.nav.height();

				if((courseWidth / courseHeight) < $(window).width() / $(window).height()){
					ratio = $(window).height() / courseHeight;
				}
				else{
					ratio = $(window).width() / courseWidth;
				}
				

				var bg = $("body");
				settings.scale = ratio;

				var transformOrigin = "left top";
				if(
					$("html").attr("dir") && $("html").attr("dir").toLowerCase() == "rtl"
					|| $("html").style("direction") && $("html").style("direction").toLowerCase() == "rtl" 
				){
					transformOrigin = "right top";
				}

				bg.css({
					"transform": "scale(" + ratio + ")",
					"max-width": "calc(100% / " + ratio + ")",
					"width": "calc(100% / " + ratio + ")",
					"transform-origin": transformOrigin
				});


				var width = $(window).width();

				if(dkiUA.isIE()){
					var menuTransformOrigin = dom.menu.hasClass("navmenu-fixed-left") ? "left top" : "right top";

					dom.menu.style({
						"transform": "scale(" + ratio + ")",
						"transform-origin": menuTransformOrigin
					});
				}

			}


			if(getMaxWidth()){
				width = $("#contentFrame").outerWidth();
			}
			
			if(!getMaxWidth()){
				dom.nav.css("max-width",width / settings.scale);
			}
			if(width < 768){
				platform = "smartphone";
				if(pinnedMenu){
					dom.outline.detach();
					dom.menu.append(dom.outline);
				}
			}
			else{
				platform = "desktop";
				if(pinnedMenu){
					dom.outline.detach();
					dom.menu.after(dom.outline);
				}			
			}
			
			var navHeight = dom.nav.outerHeight();
			$("body").css("padding-top", navHeight);
			if(dkiUA.isIE()){
				navHeight *= ratio;
			}
			dom.transcript_menu.css("top", navHeight);
			dom.menu.css("top", navHeight);			
			dom.page_navigator.css("top", navHeight);
			$("#searchBrowserContainer").css("top", navHeight);	
			if(getMaxWidth()){
				setTimeout(function(){
					var orientation = dom.menu_button.data("orientation") == "right" ? "right" : "left";
					var margin = getContentMargin(orientation);
					if(dkiUA.isIE()){
						margin = margin * ratio;
					}
					margin += "px";
					if(dom.transcript.hasClass("toggled")){
						dom.transcript_menu.css("margin-" + orientation, margin);
					}
					if(dom.menu.hasClass("toggled")){
						dom.menu.css("margin-" + orientation, margin);
					}
					if(pinnedMenu){
						dom.outline.css("margin-" + orientation, margin);
					}
				}, 100);
			
			}	


			var resizeLoopCount = 0;
			// loop through and hide 1 thing at a time until everything fits in the header
			while($("#navbar_header").length && $("#navbar_header")[0].scrollWidth - $("body")[0].scrollWidth > 0 && resizeLoopCount++ < 5){
				if($("#navbar_transcript_wrapper").is(":visible")){
					$("#navbar_transcript_wrapper").addClass("hiddenByScreenSize");
				}
				else if($("#navbar_mute_wrapper").is(":visible") || $("#navbar_narration_wrapper").is(":visible")){
					$("#navbar_mute_wrapper").addClass("hiddenByScreenSize");
					$("#navbar_narration_wrapper").addClass("hiddenByScreenSize");
				}
				else if($("#navbar_logo_wrapper").is(":visible")){
					$("#navbar_logo_wrapper").addClass("hiddenByScreenSize");
				}
				
			}

			resizeLoopCount = 0;
			while($("#navbar_header").length && $("#navbar_header")[0].scrollWidth <= $("body")[0].scrollWidth && $("#navbar_header .hiddenByScreenSize").length && resizeLoopCount++ < 5){
				var btn = $("#navbar_header .hiddenByScreenSize").first();
				btn.removeClass("hiddenByScreenSize");

				// if showing that button causes the header to be too wide then hide it again and stop trying to show things
				if($("#navbar_header")[0].scrollWidth - $("body")[0].scrollWidth > 0){
					btn.addClass("hiddenByScreenSize");
					break;
				}
			}

		}

		$(window).on("resize", handleResize);	
		handleResize();
		
		$("#navmenu_outline").on(config.settings.clickEvent, function(){
			$(theme).trigger(theme.events.outlineOpened);
		});

		//adding KB focus handling
		document.addEventListener('keydown', function(e) {
			if (e.keyCode === 9) {
				$('body').addClass('show-focus-outlines');
			}
		});

		$(".navmenu-link:not(.custom)").on("keydown", function(e){
			if(e.which == 13 || e.which == 32){
				$(this).trigger(config.settings.clickEvent);
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		});
		$(".navmenu-link.custom.open-in-modal").on("click", function(e){
				DKI.Modal.show({url: this.href});
				return false;
		});

		$('body').on(config.settings.clickEvent, "#skipToContent", function(e){
			$('body').addClass('show-focus-outlines');
		});

		dom.menu.on("click", "#bibliographyButton", function(){
			contentApi.showBibliography();			
		});

		
	};
	
	/*
		cfg: {
			settings
			contentAPI
			themeRoot - url to theme.
		}
	*/
	var init = function(cfg) {
		config = cfg;
		buildDom();
		initEvents();
		this.events = {
			themeTranscriptShown: "themeTranscriptShown",
			menuOpened: "themeMenuOpened",
			outlineOpened: "themeOutlineOpened"
		};
		return this;
	};
	window.Theme = init;
}()
