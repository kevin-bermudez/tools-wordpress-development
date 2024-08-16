<?php
  global $post;
  
  
  $idPage = is_home() || (is_single() && $post->post_type==='post') ? get_option( 'page_for_posts' ) : get_the_ID();
  $banner = get_field('banner',$idPage);

  if(!$banner){
    $banner =  get_field('generic_banner','option');
  }

  
?>
<?php if ( $banner ) :
  $url = $banner['url'];
  $alt = $banner['alt'] ? $banner['alt'] : 'Banner genérico {{PROJECT_NAME}}';
  $title = $banner['title'] ? $banner['title'] : 'Banner genérico {{PROJECT_NAME}}';
?>
  <figure class="banner-header">
    <?php
      get_template_part('partials/common/img-responsive','',
        [
            'url' => $url,
            'alt' =>  $alt,
            'title' =>  $title
        ]
      );
    ?>
  </figure>
<?php endif;?>