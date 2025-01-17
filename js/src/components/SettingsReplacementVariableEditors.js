/* global wpseoScriptData */
import { withSelect } from "@wordpress/data";
import { Component, Fragment } from "@wordpress/element";
import { replacementVariablesShape } from "@yoast/replacement-variable-editor";
import { includes, map } from "lodash";
import PropTypes from "prop-types";
import SettingsEditorPortal from "./portals/SettingsEditorPortal";
import SettingsFieldPortal from "./portals/SettingsFieldPortal";

/**
 * Renders a Portal for each element passed to it as a prop.
 *
 * Also listens for changes in the separator radio buttons and
 * updates the store with the new separator on change.
 */
class SettingsReplacementVariableEditors extends Component {
	/**
	 * Constructs the SettingsReplacementVariableEditors
	 *
	 * @param {Obj} props The props.
	 */
	constructor( props ) {
		super( props );
	}

	/**
	 * Filters the editor specific replace vars.
	 *
	 * @param {Array}  replacementVariables The replacement variables to filter.
	 * @param {string} pageType             The type of page.
	 *
	 * @returns {Array} The filtered replacevars.
	 */
	filterEditorSpecificReplaceVars( replacementVariables, pageType ) {
		const {
			editor_specific_replace_vars: editorSpecificReplaceVars = {},
			shared_replace_vars: sharedReplaceVars,
		} = wpseoScriptData.analysis.plugins.replaceVars;

		const pageTypeSpecificReplaceVars = editorSpecificReplaceVars[ pageType ] || [];
		const replaceVarNames = [ ...sharedReplaceVars, ...pageTypeSpecificReplaceVars ];

		return replacementVariables.filter( replaceVar => {
			return includes( replaceVarNames, replaceVar.name );
		} );
	}

	/**
	 * Renders all replacement variable editor components.
	 *
	 * Renders a settings replacement variable editor in every given element in
	 * the editorElements props. It requires every element to have a data-react-
	 * replacevar-title-field-id, data-react-replacevar-metadesc-field-id,
	 * data-react-replacevar-page-type-recommend and
	 * data-react-replacevar-page-type-specific attributes to function properly.
	 * The *-field-id attributes should point to existing (hidden) inputs in the
	 * DOM.
	 *
	 * @returns {Array<wp.Element>} An array of portals to instances of the
	 *                              settings replacement variable editor.
	 */
	renderEditors() {
		return map( this.props.editorElements, ( targetElement ) => {
			const {
				reactReplacevarTitleFieldId,
				reactReplacevarMetadescFieldId,
				reactReplacevarPageTypeRecommended,
				reactReplacevarPageTypeSpecific,
				reactReplacevarPaperStyle,
				reactReplacevarLabelTitle,
				reactReplacevarLabelDescription,
				reactReplacevarDescriptionPlaceholder,
				reactReplacevarHasNewBadge,
			} = targetElement.dataset;

			const filteredReplacementVariables = this.filterEditorSpecificReplaceVars(
				this.props.replacementVariables,
				reactReplacevarPageTypeSpecific,
			);

			const labels = {
				title: reactReplacevarLabelTitle,
				description: reactReplacevarLabelDescription,
			};

			return (
				<SettingsEditorPortal
					key={ reactReplacevarTitleFieldId }
					target={ targetElement }
					replacementVariables={ filteredReplacementVariables }
					recommendedReplacementVariables={ this.props.recommendedReplacementVariables[ reactReplacevarPageTypeRecommended ] }
					titleTarget={ reactReplacevarTitleFieldId }
					descriptionTarget={ reactReplacevarMetadescFieldId }
					hasPaperStyle={ reactReplacevarPaperStyle === "1" }
					labels={ labels }
					descriptionPlaceholder={ reactReplacevarDescriptionPlaceholder }
					hasNewBadge={ reactReplacevarHasNewBadge === "1" }
				/>
			);
		} );
	}

	/**
	 * Renders all replacement variable field components.
	 *
	 * Renders a settings replacement variable field in every given element in
	 * the singleFieldElements props. It requires every element to have a data-
	 * react-replacevar-field-id, data-react-replacevar-page-type-recommended
	 * and data-react-replacevar-page-type-specific attributes to function
	 * properly. The data-react-replacevar-field-id attribute should point to an
	 * existing (hidden) input in the DOM.
	 *
	 * @returns {Array<wp.Element>} An array of portals to instances of the
	 *                              settings replacement variable field.
	 */
	renderSingleFields() {
		return map( this.props.singleFieldElements, ( targetElement ) => {
			const {
				reactReplacevarFieldId,
				reactReplacevarFieldLabel,
				reactReplacevarPageTypeRecommended,
				reactReplacevarPageTypeSpecific,
			} = targetElement.dataset;
			const filteredReplacementVariables = this.filterEditorSpecificReplaceVars(
				this.props.replacementVariables,
				reactReplacevarPageTypeSpecific,
			);

			return (
				<SettingsFieldPortal
					key={ reactReplacevarFieldId }
					target={ targetElement }
					label={ reactReplacevarFieldLabel }
					replacementVariables={ filteredReplacementVariables }
					recommendedReplacementVariables={ this.props.recommendedReplacementVariables[ reactReplacevarPageTypeRecommended ] }
					fieldId={ reactReplacevarFieldId }
				/>
			);
		} );
	}

	/**
	 * Renders the SettingsReplacementVariableEditors element.
	 *
	 * @returns {wp.Element} A fragment containing all editor instances.
	 */
	render() {
		return (
			<Fragment>
				{ this.renderEditors() }
				{ this.renderSingleFields() }
			</Fragment>
		);
	}
}

SettingsReplacementVariableEditors.propTypes = {
	replacementVariables: replacementVariablesShape,
	recommendedReplacementVariables: PropTypes.object,
	editorElements: PropTypes.object,
	singleFieldElements: PropTypes.object,
};

SettingsReplacementVariableEditors.defaultProps = {
	replacementVariables: [],
	recommendedReplacementVariables: {},
	editorElements: [],
	singleFieldElements: [],
};

export default withSelect( select => {
	const { getReplaceVars, getRecommendedReplaceVars } = select( "yoast-seo/settings" );

	return {
		replacementVariables: getReplaceVars(),
		recommendedReplacementVariables: getRecommendedReplaceVars(),
	};
} )( SettingsReplacementVariableEditors );
