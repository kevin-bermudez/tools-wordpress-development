<?php
    $additionalClass = isset( $args['class'] ) && strlen( $args['class'] ) ? $args['class'] : '';
    $url = isset($args['src']) ? $args['src'] : '';

    if(isset($args['url'])){
        $url = $args['url'];
    }
?>
<img 
    src="<?php echo $url ?>" 
    alt="<?php echo $args['alt'] ?>" 
    title="<?php echo $args['title'] ?>" 
    class="img-fluid <?php echo $additionalClass ?>"
/>