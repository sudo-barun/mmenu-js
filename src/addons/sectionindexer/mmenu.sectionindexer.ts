import Mmenu from '../../core/oncanvas/mmenu.oncanvas';
import options from './_options';

import { extendShorthandOptions } from './_options';
import { extend } from '../../core/_helpers';
import * as DOM from '../../core/_dom';

Mmenu.options.sectionIndexer = options;


export default function(
	this : Mmenu
) {
	var options = extendShorthandOptions( this.opts.sectionIndexer );
	this.opts.sectionIndexer = extend( options, Mmenu.options.sectionIndexer );

	if ( !options.add ) {
		return;
	}


	this.bind( 'initPanels:after', (
		panels	: HTMLElement[]
	) => {

		//	Set the panel(s)
		if ( options.addTo != 'panels' ) {
			panels = DOM.find( this.node.menu, options.addTo )
				.filter( panel => panel.matches( '.mm-panel' ) );
		}

		panels.forEach(( panel ) => {
			DOM.find( panel, '.mm-listitem_divider' )
				.forEach(( listitem ) => {
					listitem.closest( '.mm-panel' ).classList.add( 'mm-panel_has-sectionindexer' );
				});
		});


		//	Add the indexer, only if it does not allready excists
		if ( !this.node.indx ) {
			let buttons = '';
			'abcdefghijklmnopqrstuvwxyz'.split( '' ).forEach(( letter ) => {
				buttons += '<a href="#">' + letter + '</a>';
			});

			let indexer = DOM.create( 'div.mm-sectionindexer' );
				indexer.innerHTML = buttons;

			this.node.pnls.prepend( indexer );
			this.node.indx = indexer;

			//	Prevent default behavior when clicking an anchor
			this.node.indx.addEventListener( 'click', ( evnt ) => {
				var anchor = (evnt.target as HTMLElement)

				if ( anchor.matches( 'a' ) ) {
					evnt.preventDefault();
				}
			});

			//	Scroll onMouseOver / onTouchStart
			let mouseOverEvent = ( evnt ) => {
				if ( !evnt.target.matches( 'a' ) ) {
					return;
				}

				var letter  = evnt.target.textContent,
					panel 	= DOM.children( this.node.pnls, '.mm-panel_opened' )[ 0 ];

				var newTop = -1,
					oldTop = panel.scrollTop;

				panel.scrollTop = 0;
				DOM.find( panel, '.mm-listitem_divider' )
					.filter( divider => !divider.matches( '.mm-hidden' ) )
					.forEach(( divider ) => {
						if ( newTop < 0 &&
							letter == divider.textContent.trim().slice( 0, 1 ).toLowerCase()
						) {
							newTop = divider.offsetTop;
						}
					});

				panel.scrollTop = newTop > -1 ? newTop : oldTop;
			};

			if ( Mmenu.support.touch ) {
				this.node.indx.addEventListener( 'touchstart', mouseOverEvent );
				this.node.indx.addEventListener( 'touchmove', mouseOverEvent );
			} else {
				this.node.indx.addEventListener( 'mouseover', mouseOverEvent );
			}
		}


		//	Show or hide the indexer
		this.bind( 'openPanel:start', (
			panel ?: HTMLElement
		) => {
			panel = panel || DOM.children( this.node.pnls, '.mm-panel_opened' )[ 0 ];
			this.node.menu.classList[ panel.matches( '.mm-panel_has-sectionindexer' ) ? 'add' : 'remove' ]( 'mm-menu_has-sectionindexer' );
		});
	});
};