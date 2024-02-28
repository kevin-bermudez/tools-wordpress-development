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
    <img src="<?php echo $url; ?>" alt="<?php echo $alt ?>" title="<?php echo $title ?>">
  </figure>
<?php endif;?>