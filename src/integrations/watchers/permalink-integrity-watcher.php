<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Permalink_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;

/**
 * WordPress Permalink structure watcher.
 *
 * Handles updates to the permalink_structure for the Indexables table.
 */
class Permalink_Integrity_Watcher implements Integration_Interface {

	use No_Conditionals;

	/**
	 * The indexable permalink watcher.
	 *
	 * @var Indexable_Permalink_Watcher
	 */
	protected $indexable_permalink_watcher;

	/**
	 * The indexable home url watcher.
	 *
	 * @var Indexable_HomeUrl_Watcher
	 */
	protected $indexable_homeurl_watcher;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * The permalink helper.
	 *
	 * @var Permalink_Helper
	 */
	protected $permalink_helper;

	/**
	 * The permalink helper.
	 *
	 * @var Permalink_Helper
	 */
	protected $post_type_helper;

	/**
	 * The taxonomy helper.
	 *
	 * @var Taxonomy_Helper
	 */
	protected $taxonomy_helper;


	/**
	 * Permalink_Integrity_Watcher constructor.
	 *
	 * @param Options_Helper              $option            The options helper.
	 * @param Permalink_Helper            $permalink_helper  The permalink helper.
	 * @param Indexable_Permalink_Watcher $permalink_watcher The indexable permalink watcher.
	 * @param Indexable_HomeUrl_Watcher   $homeurl_watcher   The home url watcher.
	 */
	public function __construct( Options_Helper $option,
								Permalink_Helper $permalink_helper,
								Post_Type_Helper $post_type_helper,
								Taxonomy_Helper $taxonomy_helper,
								Indexable_Permalink_Watcher $permalink_watcher,
								Indexable_HomeUrl_Watcher $homeurl_watcher ) {
		$this->options_helper              = $option;
		$this->permalink_helper            = $permalink_helper;
		$this->post_type_helper            = $post_type_helper;
		$this->taxonomy_helper             = $taxonomy_helper;
		$this->indexable_permalink_watcher = $permalink_watcher;
		$this->indexable_homeurl_watcher   = $homeurl_watcher;
	}

	/**
	 * Registers the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wpseo_frontend_presentation', [ $this, 'compare_permalink_for_page' ], 10, 1 );
	}

	/**
	 * Checks if the permalink integrity check should be performed.
	 *
	 * Returns true if the type has not been checked in the past week, false otherwise.
	 *
	 * @param string $type              "type-subtype" string of the indexable.
	 * @param array  $permalink_samples The permalink samples array.
	 *
	 * @return boolean Whether the permalink integrity check should be performed.
	 */
	public function should_perform_check( $type, $permalink_samples ) {
		return $permalink_samples[ $type ] >= ( \time() - ( 60 * 60 * 24 * 7 ) );
	}

	/**
	 * Compares the permalink of the current page to the indexable permalink. If it is not the same, the
	 * First checks if the type of the current page has been checked in the past week, if not performs the check.
	 *
	 * @param Indexable_Presentation $presentation The indexables presentation.
	 *
	 * @return void
	 */
	public function compare_permalink_for_page( $presentation ) {
		if ( $this->options_helper->get( 'dynamic_permalinks', true ) ) {
			return;
		}

		$model = $presentation->model;

		$permalink_samples = $this->options_helper->get( 'dynamic_permalink_samples' );
		$type              = $model->indexable->object_type . '-' . $model->indexable->object_sub_type;

		if ( ! $this->should_perform_check( $type, $permalink_samples ) ) {
			$this->update_permalink_samples( $type, $permalink_samples );
			return;
		}

		// if permalink of current page is the same as the indexable permalink, do nothing.
		if ( $model->permalink === $this->permalink_helper->get_permalink_for_indexable( $model ) ) {
			$this->update_permalink_samples( $type, $permalink_samples );
			return;
		}

		if ( $this->indexable_permalink_watcher->should_reset_permalinks() ||
			$this->indexable_permalink_watcher->should_reset_categories() ||
			$this->indexable_permalink_watcher->should_reset_tags()
		) {
			$this->indexable_permalink_watcher->force_reset_permalinks();
			$this->update_permalink_samples( $type, $permalink_samples );
			return;
		}

		if ( $this->indexable_homeurl_watcher->should_reset_permalinks() ) {
			$this->indexable_homeurl_watcher->force_reset_permalinks();
			$this->update_permalink_samples( $type, $permalink_samples );
			return;
		}

		// If no reason is found for the difference in permalinks, the dynamic permalink mode is enabled.
		$this->options_helper->set( 'dynamic_permalinks', true );
	}

	/**
	 * Collects all public post and taxonomy types and saves them in an associative holding the combination of
	 * indexable object_type and object_sub_type as the key and a timestamp as the value.
	 *
	 * @return array The associative array with the object-type and object-sub-type as the key
	 * and a timestamp value as the value.
	 */
	public function collect_dynamic_permalink_samples() {
		$permalink_samples = [];

		$post_types = $this->post_type_helper->get_public_post_types();
		foreach ( $post_types as $type ) {
			$permalink_samples[ "post-" . $type ] = \time();
		}

		$taxonomies = $this->taxonomy_helper->get_public_taxonomies();
		foreach ( $taxonomies as $type ) {
			$permalink_samples[ "term-" . $type ] = \time();
		}

		return $permalink_samples;
	}

	/**
	 * Updated the dynamic_permalink_samples options with a new timestamp for $type.
	 *
	 * @param string $type              "type-subtype" string of the indexable.
	 * @param array  $permalink_samples The permalink samples array.
	 *
	 * @return void
	 */
	private function update_permalink_samples( $type, $permalink_samples ) {
		$permalink_samples[ $type ] = \time();
		$this->options_helper->set( 'dynamic_permalink_samples', $permalink_samples );
	}
}