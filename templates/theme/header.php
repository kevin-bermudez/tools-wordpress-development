<!DOCTYPE html>
<html lang="es-CO">

<head>
  <?php wp_head() ?>
  <meta name="language" content="es-CO" />
  <meta name="country" content="COL" />
  <meta name="currency" content="COP" />
  <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
  <meta charset="UTF-8">
  <meta name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=1 user-scalable=no, viewport-fit=cover" />
  <title>
    <?php kd_meta_title() ?>
  </title>
  <!--style.css-->
  <link rel="stylesheet" href="<?php bloginfo('stylesheet_url') ?>" />
  <!--Favicon-->
  <link rel="icon" type="image/png" href="<?php echo get_field('favicon','option') ?>" />
</head>
<header class="{{PROJECT_NAME_FOR_CSS_CLASS}}-header">
  <?php get_template_part('partials/common/logo','',['class' => '{{PROJECT_NAME_FOR_CSS_CLASS}}-header']) ?>
</header>

<body <?php body_class() ?>>
  