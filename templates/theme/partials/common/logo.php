<?php
  $logo = get_field('logo','option');
  $additionalClass = isset($args['class']) ? $args['class'] : '' ?>__logo img-fluid";
?>
<a href="<?php echo get_bloginfo('url') ?>">
    <?php
      get_template_part('partials/common/img-responsive','',array_merge($logo,
      [
        'class' => $additionalClass
      ]
      ))
    ?>
</a>