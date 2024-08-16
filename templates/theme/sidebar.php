<div class="sidebar">

  <h3 class="sidebar-title sidebar__title">
    <?php echo 'Buscar' ?>
  </h3>
  <div class="sidebar-item search-form sidebar__item">
    <?php get_search_form() ?>
  </div><!-- End sidebar search formn-->

  <h3 class="sidebar-title sidebar__title">
  <?php echo 'Categorías' ?>
  </h3>
  <div class="sidebar-item categories sidebar__item">
    <ul>
      <?php 
      $cat_argtos=array(
        'orderby' => 'name',
        'order' => 'ASC'
         );
      $categorias=get_categories($cat_argtos);
      foreach($categorias as $categoria) {
      ?>
        <li><a href="<?php echo get_category_link($categoria) ?>">
          <?php echo $categoria->cat_name ?> 
          <span>(<?php echo $categoria->count ?>)</span></a></li>
      <?php
      }
      ?>

    </ul>
  </div><!-- End sidebar categories-->

  <h3 class="sidebar-title sidebar__title">
  <?php echo 'Últimas entradas' ?>
  </h3>
  <div class="sidebar-item recent-posts sidebar__item">
    <?php $args = array( 'numberposts' => 4); $posts = wp_get_recent_posts( $args ); ?>

    <?php foreach($posts as $post): ?>
      <div class="post-item clearfix">
        <?php $image = kd_get_feature_image( $post['ID'] ) ?>
        <?php if($image): ?>
          <?php
              get_template_part('partials/common/img-responsive','',$image);
          ?>
        <?php endif; ?>
        <h4>
          <a href="<?php echo get_the_permalink( $post['ID'] ) ?>">
            <?php echo $post['post_title'] ?>
          </a>
        </h4>
        <time datetime="<?php echo get_the_date('Y-m-d',$post['ID']) ?>">
          <?php echo get_the_date('M d Y',$post['ID']) ?>
        </time>
      </div>
    <?php endforeach; ?>

  </div><!-- End sidebar recent posts-->
  <?php $tags = get_tags() ?>

  <?php if(count($tags)): ?>
  <h3 class="sidebar-title sidebar__title">
    <?php echo 'Etiquetas' ?>
  </h3>
  <div class="sidebar-item tags sidebar__item">
    <ul>
      <?php foreach($tags as $tag): ?>
        <li>
          <a href="<?php echo get_tag_link($tag->term_id) ?>">
            <?php echo $tag->name ?>
          </a>
        </li>
      <?php endforeach; ?>
    </ul>
  </div><!-- End sidebar tags-->
  <?php endif; ?>
</div><!-- End sidebar -->