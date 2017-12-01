import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import { getChildrenCount } from "../../../../utils/reactUtils";
import { angleUp, angleDown } from "../../../../style-guide/svg";
import colors from "../../../../style-guide/colors.json";
import { IconButton } from "../../Shared/components/Button";

const AnalysisHeaderContainer = styled.div`
	background-color: ${ colors.$color_white };
`;

const AnalysisHeaderButton = styled( IconButton )`
	width: 100%;
	background-color: ${ colors.$color_white };
	padding: 0;
	border-color: transparent;
	border-radius: 0;
	outline: none;
	justify-content: flex-start;
	box-shadow: none;
	// When clicking, the button text disappears in Safari 10 because of color: activebuttontext.
	color: ${ colors.$color_blue };

	:hover {
		border-color: transparent;
		color: ${ colors.$color_blue };
	}

	:active {
		box-shadow: none;
		background-color: ${ colors.$color_white };
		color: ${ colors.$color_blue };
	}

	svg {
		margin: 0 8px 0 -5px; // (icon 20 + button border 1) - 5 = 16 for the 8px grid
		width: 20px;
		height: 20px;
	}
`;

const AnalysisTitle = styled.span`
	margin: 8px 0;
	word-wrap: break-word;
	font-size: 1.25em;
	line-height: 1.25;
`;

const AnalysisList = styled.ul`
	margin: 0;
	list-style: none;
	padding: 0 16px 0 0;
`;

/**
 * Wraps a component in a heading element with a defined heading level.
 *
 * @param {ReactElement} Component    The component to wrap.
 * @param {int}          headingLevel The heading level.
 *
 * @returns {ReactElement} The wrapped component.
 */
function wrapInHeading( Component, headingLevel ) {
	const Heading = `h${ headingLevel }`;
	const StyledHeading = styled( Heading )`
		margin: 0;
		font-weight: normal;
	`;

	return function Wrapped( props ) {
		return (
			<StyledHeading>
				<Component { ...props } />
			</StyledHeading>
		);
	};
}

/**
 * A collapsible header used to show sets of analysis results. Expects list items as children.
 * Optionally has a heading around the button.
 *
 * @param {object} props The properties for the component.
 *
 * @returns {ReactElement} A collapsible analysisresult set.
 */
export const AnalysisCollapsibleStateless = ( props ) => {
	let title = props.title;
	let count = getChildrenCount( props.children );

	const Button = props.element;

	return (
		<AnalysisHeaderContainer>
			<Button
				aria-expanded={ props.isOpen }
				onClick={ props.onToggle }
				icon={ props.isOpen ? angleUp : angleDown }
				iconColor={ colors.$color_grey_dark } >
				<AnalysisTitle>{ `${ title } (${ count })` }</AnalysisTitle>
			</Button>
			{
				props.isOpen && props.children &&
					<AnalysisList role="list">{ props.children }</AnalysisList>
			}
		</AnalysisHeaderContainer>
	);
};

AnalysisCollapsibleStateless.propTypes = {
	title: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	hasHeading: PropTypes.bool,
	headingLevel: PropTypes.number,
	onToggle: PropTypes.func.isRequired,
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
	element: PropTypes.func,
};

AnalysisCollapsibleStateless.defaultProps = {
	hasHeading: false,
	headingLevel: 2,
};

export class AnalysisCollapsible extends React.Component {
	/**
	 * The constructor.
	 *
	 * @param {Object} props The props to use.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			isOpen: null,
		};

		this.toggleOpen = this.toggleOpen.bind( this );

		/*
		 * Evaluate if the button should be wrapped in a heading in this constructor
		 * instead of doing it in the AnalysisCollapsibleStateless component to
		 * avoid a full re-render of the button, which is bad for accessibility.
		 */
		this.element = props.hasHeading ? wrapInHeading( AnalysisHeaderButton, props.headingLevel ) : AnalysisHeaderButton;
	}

	/**
	 * Toggles whether the list is collapsed.
	 *
	 * @returns {void}
	 */
	toggleOpen() {
		if ( this.state.isOpen === null && this.props.initialIsOpen ) {
			this.setState( {
				isOpen: !! this.state.isOpen,
			} );
		}
		this.setState( {
			isOpen: ! this.state.isOpen,
		} );
		console.log("this", this);
		console.log("this.state", this.state);
	}

	/**
	 * Returns whether or not the collapsible should be rendered open or closed.
	 *
	 * @returns {boolean} Whether or not this component is open.
	 */
	isOpen() {
		// When `isOpen` is null then the user has never opened or closed the collapsible.
		if ( this.state.isOpen === null ) {
			return this.props.initialIsOpen;
		}
		return this.state.isOpen === true;
	}

	/**
	 * Returns the rendered AnalysisCollapsible element.
	 *
	 * @returns {ReactElement} The rendered collapsible analysisHeader.
	 */
	render() {
		return (
			<AnalysisCollapsibleStateless
				title={ this.props.title }
				onToggle={ this.toggleOpen.bind( this ) }
				isOpen={ this.isOpen() }
				hasHeading={ this.props.hasHeading }
				headingLevel={ this.props.headingLevel }
				element={ this.element }
			>
				{ this.props.children }
			</AnalysisCollapsibleStateless>
		);
	}
}

AnalysisCollapsible.propTypes = {
	title: PropTypes.string.isRequired,
	initialIsOpen: PropTypes.bool,
	hasHeading: PropTypes.bool,
	isOpen: PropTypes.bool,
	headingLevel: PropTypes.number,
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
};

AnalysisCollapsible.defaultProps = {
	initialIsOpen: false,
	hasHeading: false,
	headingLevel: 2,
};

export default AnalysisCollapsible;
