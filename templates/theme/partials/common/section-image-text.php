<?php
    $additionalClassContainer = isset($args['additional_class_container']) ? $args['additional_class_container'] : '';
    $additionalClassImage = isset($args['additional_class_image']) ? $args['additional_class_image'] : '';
    $additionalClassTitle = isset($args['additional_class_title']) ? $args['additional_class_title'] : '';
    $additionalClassText = isset($args['additional_class_text']) ? $args['additional_class_text'] : '';
    $title = $args['title'];
    $diffColorChar = isset($args['diff_color_char']) ? $args['diff_color_char'] : false;
    $text = $args['text'];
    $textRight = isset($args['text_right']) ? $args['text_right'] : false;
    $image = $args['image'];
    $buttonUrl = isset($args['url']) ? $args['url'] : false;
    $buttonText = isset($args['button_text']) ? $args['button_text'] : 'Más información';
    $tags = isset($args['tags']) ? $args['tags'] : false;
    $targetBlank = isset($args['target_blank']) ? $args['target_blank'] : false;

    $homeVariant = isset($args['home_variant']) ? $args['home_variant'] : '';
    $id = isset($args['id']) ? $args['id'] : null;
?>

<section class="row align-items-center <?php echo $additionalClassContainer ?>" <?php echo $id ? 'id="' . $id . '"' : '' ?>>
    <figure class="col-12 col-lg-6 <?php echo $textRight ? 'order-lg-2' : '' ?>">
        <div class="<?php echo $additionalClassImage ?>-container">
            <?php
                get_template_part('partials/common/img-responsive','',array_merge(
                    $image,
                    [
                        'class' => 
                    ]
                ))
            ?>
        </div>
    </figure>
    <section class="col-12 col-lg-6 section-image-text__text-container <?php echo $textRight ? 'text-lg-right order-lg-1' : '' ?>">
        <?php if($diffColorChar): ?>
            <h2 class="char-with-diff-color title-different-char <?php echo $homeVariant ? 'title-different-char--home-variant' :   'title-different-char--about-variant' ?> <?php echo $additionalClassTitle ?>" data-char-diff="<?php echo $diffColorChar ?>" data-base-class="title-different-char">
        <?php else:?>
            <h2 class="{{PROJECT_NAME_FOR_CSS_CLASS}}__title-normal <?php echo $additionalClassTitle ?>">
        <?php endif; ?>
            <?php echo $title ?>
        </h2>
        <article class="<?php echo $additionalClassText ?> {{PROJECT_NAME_FOR_CSS_CLASS}}__text-normal">
            <?php echo $text ?>
        </article>
        <?php if($tags): ?>
            <section class="{{PROJECT_NAME_FOR_CSS_CLASS}}__tags-normal">
                <?php foreach($tags as $tag): ?>
                    <div class="{{PROJECT_NAME_FOR_CSS_CLASS}}__tags-normal-tag d-inline-block">
                        <span class="{{PROJECT_NAME_FOR_CSS_CLASS}}__tags-normal-tag-container <?php echo $tag['single_line'] ? 'single-line' : '' ?>">
                            <?php echo $tag['tag'] ?>
                        </span>
                    </div>
                <?php endforeach; ?>
            </section>
        <?php endif; ?>
        <?php if($buttonUrl): ?>
            <a href="<?php echo $buttonUrl ?>" <?php echo $targetBlank ? 'target="blank"' : '' ?> class="btn btn-primary">
                <?php echo $buttonText ?>
            </a>
        <?php endif; ?>
    </section>
  </section>