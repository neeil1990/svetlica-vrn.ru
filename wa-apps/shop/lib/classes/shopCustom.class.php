<?php

class shopCustom
{

    public static function p($data = false){
        if($data)
            return 'от';
        else
            return 'Цена от';
    }

    public static function array_filter($array, $field){

        if(!is_array($array) || empty($field))
            return false;

        $data = array_filter($array, function ($k) use ($field){

            return preg_match("/$field/", $k);
        }, ARRAY_FILTER_USE_KEY);

        return ($data) ?: false;
    }


    public static function getListProducts($ids, $title = '', $template){

        $ids = json_decode($ids, true);

        if(!$ids)
            return false;

        if(empty($template))
            $template = "list-thumbs";

        $arKeys = array_keys($ids);
        $collection = new shopProductsCollection($arKeys);
        $products = $collection->getProducts("*,image_crop_small");

        uksort($products, function ($leftItem, $rightItem) use ($arKeys){

            $order = array_flip($arKeys);

            $leftPos = $order[$leftItem];
            $rightPos = $order[$rightItem];

            return $leftPos >= $rightPos;
        });

        foreach ($ids as $key => $val){

            if(isset($products[$key])){

                $products[$key]['seo_name'] = $products[$key]['name'];

                if($val[0]){
                    $products[$key]['name'] = $val[0];
                    $products[$key]['seo_name'] = $val[0];
                }

                if($val[1])
                    $products[$key]['summary'] = $val[1];
            }
        }

        //list-thumbs, list-thumbs-list, list-thumbs-mini

        $view = wa()->getView();
        $view->assign('recommend_product', true);
        $view->assign('pages_count', false);
        $view->assign('products', $products);
        $html = $view->fetch(wa()->getDataPath('themes', true, 'shop') . '/insales/'. $template .'.html');

        if($title)
            $html = '<div class="in-blocks__title"><div class="in-blocks__title-name category-name">'. $title .'</div></div>'.$html;

        return $html;
    }

}
