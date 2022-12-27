package com.hxari.rewriter;

import android.app.Activity;
import android.os.Bundle;

import com.hxari.rewriter.R;

/*
 * MainActivity
 *
 * @extends android.app.Activity
 * @package com.hxari.rewriter
 */
public class MainActivity extends Activity
{
	
	/*
	 * @inherit android.app.Activity
	 *
	 */
	@Override
	protected void onCreate( Bundle savedInstanceState )
	{
		super.onCreate( savedInstanceState );
		setContentView( R.layout.activity_main );
	}
	
}