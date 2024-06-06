<?php
  $logo = get_field('logo','option');
?>
<a href="<?php echo get_bloginfo('url') ?>">
    <img src="<?php echo $logo['url'] ?>" alt="<?php echo $logo['alt'] ?>" title="<?php echo $logo['title'] ?>"
    class="<?php echo isset($args['class']) ? $args['class'] : '' ?>__logo img-fluid" />
</a>