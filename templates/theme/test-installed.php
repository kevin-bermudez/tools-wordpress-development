<?php

define( 'WP_USE_THEMES', true );

require_once dirname(dirname(dirname(__DIR__))) . '/wp-load.php';

if(is_blog_installed()){
  echo "true";
}