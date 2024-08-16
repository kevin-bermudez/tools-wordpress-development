<?php /* Template Name: Plantilla de blog */ ?>
<?php get_header(); ?>

  <!-- ======= Header ======= -->
  

  <main class="main">
<?php get_template_part('partials/common/banner-title-archive') ?>
<!-- ======= Blog Section ======= -->
<section id="blog" class="blog">
  <div class="container" >

    <div class="row">

      <div class="col-lg-8 entries">

      <?php if (have_posts()) : while (have_posts()) : the_post();?>

         <article class="entry row m-0">

          <figure class="entry-img col-12 col-md-4">
            <?php
              $image = kd_get_feature_image( get_the_ID() )
            ?>

            <?php if($image): ?>
              <img src="<?php echo $image['url']; ?>" alt="<?php echo $image['alt']; ?>" title="<?php echo $image['title'] ?>" class="img-fluid" />
            <?php endif; ?>
          </figure>
          
            <section class="col-12 col-md-8">
                <h2 class="entry-title">
                    <a href="<?php the_permalink() ?>">
                    <?php the_title(); ?>
                    </a>
                </h2>

                <div class="entry-content">
                    <p>
                        <?php the_excerpt(); ?>
                    </p>
                    <div class="read-more">
                        <a href="<?php the_permalink() ?>" class="btn">Leer más</a>
                    </div>
                </div>
            </section>

        </article>
        <div class="blog-pagination">
          <ul class="justify-content-center">
            <?php 
              $currentPage = (get_query_var('paged')) ? get_query_var('paged') : 1;
              $pages = paginate_links([
                'type' => 'array'
              ]);
              
              if($pages):
              foreach($pages as $page):
            ?>
              <li>
                <?php echo $page ?>
              </li>
            <?php endforeach;endif; ?>
          </ul>
        </div>

      <?php endwhile;endif; ?>

      </div><!-- End blog entries list -->

      <div class="col-lg-4">

        <?php get_sidebar() ?>

      </div><!-- End blog sidebar -->

    </div>

  </div>
</section><!-- End Blog Section -->

</main><!-- End #main -->

<?php get_footer() ?>