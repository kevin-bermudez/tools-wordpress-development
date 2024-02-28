<?php

if (!function_exists('kd_meta_title')) {
  /**
   * kd_meta_title
   *
   * @return void
   */
  function kd_meta_title()
  {
    global $wp_query;
    if (is_home()) {
      echo bloginfo('name');
      echo ' | ';
      bloginfo('description');
    } elseif (is_category()) {
      single_cat_title();
      echo ' | ';
      echo bloginfo('name');
    } elseif (is_single() || is_page()) {
      global $wp_query;

      $defaultTitle = get_the_title();
      $title = (strlen($defaultTitle) ? get_the_title() : isset($wp_query->queried_object) && strlen($wp_query->queried_object->post_title)) ? $wp_query->queried_object->post_title : '';  
      
      echo $title;
      echo ' | ';
      echo bloginfo('name');
    } elseif (is_archive()) {
      if (is_tax()) {
        echo ucwords(mb_strtolower(single_cat_title('', false))) .
          ' | ' .
          get_bloginfo('name');
      }
    } else {
      wp_title('', true);
    }
  }
}

//register position menus for the theme
// register_nav_menus([
//   'principal_left' => __('Menú principal izquierda', ''),
//   'principal_right' => __('Menú principal derecha', '')
// ]);

//options pages
if (function_exists('acf_add_options_page')) {
  acf_add_options_page([
    'page_title' => 'Configuración {{PROJECT_NAME}}',
    'menu_title' => 'Configuración {{PROJECT_NAME}}',
    'menu_slug' => 'theme-general-settings',
    'capability' => 'edit_posts',
    'redirect' => false,
  ]);
}

//current item menu add class
if (!function_exists('special_nav_class')) {
  add_filter('nav_menu_css_class', 'special_nav_class', 10, 2);

  function special_nav_class($classes, $item)
  {
    if (in_array('current-menu-item', $classes)) {
      $classes[] = 'active ';
    }
    return $classes;
  }
}

//no admin bar in front of the site
add_filter('show_admin_bar', '__return_false');

//insert js
if (!function_exists('kd_insert_js')) {
  add_action('wp_enqueue_scripts', 'kd_insert_js');

  function kd_insert_js()
  {
    wp_enqueue_script('jquery');

    wp_register_script(
      'popper',
      get_stylesheet_directory_uri() . '/js/libs/bootstrap/popper.min.js'
    );
    wp_enqueue_script('popper');

    wp_register_script(
      'bootstrap',
      get_stylesheet_directory_uri() . '/js/libs/bootstrap/bootstrap.min.js'
    );
    wp_enqueue_script('bootstrap');

    wp_register_script(
      'wow',
      get_stylesheet_directory_uri() . '/js/libs/wow.min.js'
    );
    wp_enqueue_script('wow');

    wp_register_script(
      'slick',
      get_stylesheet_directory_uri() . '/js/libs/slick.min.js'
    );
    wp_enqueue_script('slick');

    wp_register_script(
      'kd_main',
      get_stylesheet_directory_uri() . '/js/main.js?ver=' . rand(), array('wow'),false,true
    );
    wp_enqueue_script('kd_main');
    
    wp_enqueue_script( 'kd_wp_configs','kd_wp_configs' );
    wp_add_inline_script( 'kd_wp_configs', "
      window.wpConfigs = {
        resources_url : '" . get_stylesheet_directory_uri() . "'
      }
    ", 'before' );
  }
}

if(!function_exists(('kd_get_whatsapp_number'))){
  function kd_get_whatsapp_number(){
    return get_field('whatsapp_number','option');
  }
}

//
if (!function_exists('kd_get_whatsapp_link')) {
  function kd_get_whatsapp_link($whatsappNumber = null, $text = 'hola')
  {
    $whatsapp = $whatsappNumber ? $whatsappNumber : kd_get_whatsapp_number();

    // if($text === 'hola'){
    //     $text = translate('whatsapp_message_text','cosse');
    // }

    return 'https://wa.me/'.
    $whatsapp .
    '?text=' .
    $text;

    if (wp_is_mobile()) {
      return 'https://api.whatsapp.com/send?phone=' .
        $whatsapp .
        '&text=' .
        $text;
    } else {
      return 'https://web.whatsapp.com/send?phone=' .
        $whatsapp .
        '&text=' .
        $text;
    }
  }
}

if(!function_exists('kdIsMultipleOf')){
  function kdIsMultipleOf($number,$control){
    return !($number % $control);
  }
}

if(!function_exists('kd_slugify')){
  function kd_slugify($text, string $divider = '-')
  {
    // replace non letter or digits by divider
    $text = preg_replace('~[^\pL\d]+~u', $divider, $text);
  
    // transliterate
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
  
    // remove unwanted characters
    $text = preg_replace('~[^-\w]+~', '', $text);
  
    // trim
    $text = trim($text, $divider);
  
    // remove duplicate divider
    $text = preg_replace('~-+~', $divider, $text);
  
    // lowercase
    $text = strtolower($text);
  
    if (empty($text)) {
      return 'n-a';
    }
  
    return $text;
  }
}