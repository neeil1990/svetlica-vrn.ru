<?php

class shopShopProducts_collectionFilterHandler extends waEventHandler
{
    public function execute(&$params, $event_name = null)
    {
        $cat_id = ($params->getInfo()['id']) ?: false;
        $category_params_model = new shopCategoryParamsModel();
        $params_cat = $category_params_model->get($cat_id);

        if($params_cat['products_per_page'])
            waRequest::setParam('products_per_page', $params_cat['products_per_page']);
        else
            waRequest::setParam('products_per_page');
    }
}
