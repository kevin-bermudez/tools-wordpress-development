<?php get_header() ?>

<?php if (have_posts()) : while (have_posts()) : the_post();?>
<?php //get_template_part('partials/common/banner') ?>

<main class="container">
  <article class="row">
    <h1 class="col-12 text-center">
      <?php the_title() ?>
    </h1>
    <p class="col-12">
      <?php the_content(); ?>
    </p>
  </article>
</main>

<?php endwhile;endif; ?>

<?php get_footer() ?>