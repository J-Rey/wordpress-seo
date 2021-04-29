/**
 * WordPress e2e utilities
 */
import {
	createNewPost,
	installPlugin,
} from '@wordpress/e2e-test-utils';

describe( 'Yoast SEO plugin metabox', () => {
	beforeEach( async () => {
		// Testing this with Yoast plugin installed and activated
		// on my WordPress install  (wp-env start run from the plugin folder)

		// await installPlugin( 'wordpress-seo' );
	} );

	it( 'should contains the Yoast SEO plugin metabox', async () => {
		await createNewPost();

		const yoastSeoMetabox = await page.$x(
			`//*[contains(@class, 'postbox yoast wpseo-metabox')]`
		);
		expect( yoastSeoMetabox.length ).toBe( 1 );
	} );
} );