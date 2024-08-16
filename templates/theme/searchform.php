<form role="search" method="get" id="search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
  <input type="text" name="s" value="<?php echo esc_attr( get_search_query() ); ?>">
  <button type="submit">
    <i class="icon-search"></i>
  </button>
</form>