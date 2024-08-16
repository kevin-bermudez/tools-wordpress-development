<?php get_header() ?>
  <main id="main">

    <!-- ======= Blog Single Section ======= -->
    <section id="single-post" class="single-post">
      <div class="container wow fadeInUp">

        <div class="row">

          <div class="col-lg-8 entries">
          <?php if (have_posts()) : while (have_posts()) : the_post();?>
            <article class="entry entry-single">

              
                <?php
                    $image = kd_get_feature_image( get_the_ID() )
                ?>

                <?php if($image): ?>
                  <div class="entry-img">
                    <?php
                        get_template_part('partials/common/img-responsive','',
                        array_merge(
                            $image,
                            ['class' => 'single-post__image'] 
                        )
                        );
                    ?>
                  </div>
                <?php endif; ?>

              <h2 class="single-post__title">
                  <?php the_title(); ?>
              </h2>

              <div class="entry-meta single-post__meta">
                <ul class="single-post__meta-container">
                  <li class="d-flex align-items-center single-post__meta-item">
                    <?php the_author() ?>
                  </li>
                  <!-- <li class="d-flex align-items-center single-post__meta-item"><time datetime="<?php echo get_the_date('Y-m-d') ?>">
                    <?php the_date(); ?>
                  </time></li> -->
                  <li class="d-flex align-items-center single-post__meta-item">
                    
                    <?php echo get_comments_number() ?> <?php echo 'Comentarios' ?>

                    </li>
                </ul>
              </div>

              <div class="entry-content single-post__content">
                <?php the_content(); ?>
              </div>

              <div class="entry-footer single-post__footer">
                <?php $categories = get_the_category() ?>
                
                <?php if($categories): ?>
                    <div class="single-post__categories-title">
                        <?php echo 'Categorías' ?>
                    </div>
                  <ul class="cats single-post__categories">
                    <?php foreach($categories as $category): ?>
                      <li><a href="<?php echo get_category_link($category) ?>" class="category-link">
                        <?php echo $category->name ?>
                      </a></li>
                    <?php endforeach; ?>
                  </ul>
                <?php endif; ?>

                <?php $tags = get_the_tags() ?>
                
                <?php if($tags): ?>
                <div class="single-post__tags-title">
                <?php echo 'Etiquetas' ?>
                </div>
                  <ul class="tags single-post__tags">
                    <?php foreach($tags as $tag): ?>
                      <li><a href="<?php echo get_tag_link($tag) ?>">
                        <?php echo $tag->name ?>
                      </a></li>
                    <?php endforeach; ?>
                  </ul>
                <?php endif; ?>
              </div>

            </article><!-- End blog entry -->

            <div class="single-post__blog-author d-flex align-items-center">
            <?php $userId = get_the_author_meta('ID'); $avatar = kd_get_avatar( $userId ) ?>
            <?php if($avatar['url']): ?>
                <?php
                    get_template_part('partials/common/img-responsive','',
                        array_merge(
                            $avatar,
                            ['class' => 'rounded-circle float-left single-post__avatar'] 
                        )
                    );
                ?>
            <?php else: ?>
                <?php
                    get_template_part('partials/common/img-responsive','',
                        [
                            'url' => get_template_directory_uri() . '/src/images/blog-author.jpg',
                            'alt' =>  $avatar['alt'],
                            'title' =>  $avatar['title'],
                            'class' => 'rounded-circle float-left single-post__avatar'
                        ]
                    );
                ?>
            <?php endif; ?>
              
              <div class="single-post__author-data">
                <h4>
                  <?php the_author() ?>
                </h4>
                <p>
                  <?php echo get_the_author_meta( 'description', $userId ); ?>
                </p>
              </div>
            </div><!-- End blog author bio -->

            <div class="blog-comments">            

              <?php 
                if ( comments_open() ) :
                  comments_template();
                endif;
              ?>
            </div><!-- End blog comments -->

          <?php endwhile;endif; ?>
          </div><!-- End blog entries list -->

          <div class="col-lg-4">



            <?php get_sidebar() ?>
              


          </div><!-- End blog sidebar -->

        </div>

      </div>
    </section><!-- End Blog Single Section -->

  </main><!-- End #main -->

<?php get_footer(); ?>