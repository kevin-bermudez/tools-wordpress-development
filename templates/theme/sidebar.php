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
    <!-- <pre>
      <?php //print_r($posts) ?>
    </pre> -->
    <?php foreach($posts as $post): ?>
      <div class="post-item clearfix">
        <?php $image = kd_get_feature_image( $post['ID'] ) ?>
        <?php if($image): ?>
          <img src="<?php echo $image['url'] ?>" alt="<?php echo $image['alt'] ?>" title="<?php echo $image['title'] ?>" class="img-fluid"/>
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
    <!-- <div class="post-item clearfix">
      <img src="assets/img/blog/blog-recent-1.jpg" alt="">
      <h4><a href="blog-single.html">Nihil blanditiis at in nihil autem</a></h4>
      <time datetime="2020-01-01">Jan 1, 2020</time>
    </div>

    <div class="post-item clearfix">
      <img src="assets/img/blog/blog-recent-2.jpg" alt="">
      <h4><a href="blog-single.html">Quidem autem et impedit</a></h4>
      <time datetime="2020-01-01">Jan 1, 2020</time>
    </div>

    <div class="post-item clearfix">
      <img src="assets/img/blog/blog-recent-3.jpg" alt="">
      <h4><a href="blog-single.html">Id quia et et ut maxime similique occaecati ut</a></h4>
      <time datetime="2020-01-01">Jan 1, 2020</time>
    </div>

    <div class="post-item clearfix">
      <img src="assets/img/blog/blog-recent-4.jpg" alt="">
      <h4><a href="blog-single.html">Laborum corporis quo dara net para</a></h4>
      <time datetime="2020-01-01">Jan 1, 2020</time>
    </div>

    <div class="post-item clearfix">
      <img src="assets/img/blog/blog-recent-5.jpg" alt="">
      <h4><a href="blog-single.html">Et dolores corrupti quae illo quod dolor</a></h4>
      <time datetime="2020-01-01">Jan 1, 2020</time>
    </div> -->

  </div><!-- End sidebar recent posts-->
  <?php $tags = get_tags() ?>
  <!-- <pre>
    <?php //print_r($tags) ?>
  </pre> -->
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
      <!-- <li><a href="#">App</a></li>
      <li><a href="#">IT</a></li>
      <li><a href="#">Business</a></li>
      <li><a href="#">Mac</a></li>
      <li><a href="#">Design</a></li>
      <li><a href="#">Office</a></li>
      <li><a href="#">Creative</a></li>
      <li><a href="#">Studio</a></li>
      <li><a href="#">Smart</a></li>
      <li><a href="#">Tips</a></li>
      <li><a href="#">Marketing</a></li> -->
      <?php endforeach; ?>
    </ul>
  </div><!-- End sidebar tags-->
  <?php endif; ?>
</div><!-- End sidebar -->