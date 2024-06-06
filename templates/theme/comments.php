<?php
require __DIR__ . '/KdWalkerComment.php';

?>

<h4 class="comments-count"><?php echo get_comments_number() ?> <?php echo 'Comentarios' ?></h4>

<div class="reply-form">
  <?php comment_form() ?>
</div>

<?php

if(have_comments()):
?>

<?php 
  wp_list_comments([
    'style' => 'div',
    'avatar_size' => 60,
    'reverse_top_level' => true,
    'walker' => new KdWalkerComment()
  ]) 
?>

<?php
endif;
?>