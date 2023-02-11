
const rootPath = "https://vue3-course-api.hexschool.io";
const api_path = "charizard";


Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

const productModal = {
    props:['id','addToCart','getInfo'],
    data(){
        return {
            modal:{},
            tempProduct:{},
            qty:1
        };
    },

    template:'#userProductModal',
    watch:{
        id(){
           
            if(this.id){
                axios.get(`${rootPath}/v2/api/${api_path}/product/${this.id}`)
                .then(res=>{
                    this.tempProduct = res.data.product;               
                    this.modal.show();
                    
                })
            }
            
        }
    },
    methods:{
        hide(){
            this.modal.hide();
        }
    },

    mounted(){
        this.modal = new bootstrap.Modal(this.$refs.modal);
        this.$refs.modal.addEventListener('hidden.bs.modal',(event)=>{this.getInfo('');});
    }
}



const app = Vue.createApp({
    
    data(){
        return {
            productId:'',
            products:[],
            cart:{},
            loadingItem:'',
            infoIsLoading:false,
            addToCartIsLoading:false,
            deleteItemIsLoading:false
        }
    },
    methods:{
        getProduct(){
            axios.get(`${rootPath}/v2/api/${api_path}/products/all`)
            .then(res=>{
                this.products = res.data.products;         
            })
        },
        getInfo(id){
            this.productId = id;  
            this.infoIsLoading = true;
            setTimeout(() =>  this.infoIsLoading = false, 1000);
        },
        addToCart(product_id,qty = 1){

            this.addToCartIsLoading = true;
            const data={
                product_id,
                qty
            }

            axios.post(`${rootPath}/v2/api/${api_path}/cart`,{data})
            .then(res=>{
                   
                this.$refs.productModal.hide();
                this.getCart();
                this.addToCartIsLoading = false;
            })
        },
        getCart(){
            axios.get(`${rootPath}/v2/api/${api_path}/cart`)
            .then(res=>{
                this.cart = res.data.data;         
            })
        },
        updateCart(item){
            this.loadingItem = item.id;

            const data = {
                "product_id": item.product.id,
                "qty": item.qty
            }

            axios.put(`${rootPath}/v2/api/${api_path}/cart/${item.id}`,{ data })
            .then(res=>{
                
                this.loadingItem = '';
                this.getCart();
            })
        },
        deleteItem(item){
            this.loadingItem = item.id;
            this.deleteItemIsLoading = true;
            const data = {
                "product_id": item.product.id,
                "qty": item.qty
            }

            axios.delete(`${rootPath}/v2/api/${api_path}/cart/${item.id}`)
            .then(res=>{
                this.loadingItem = '';
                this.getCart();
                this.deleteItemIsLoading = false;
            })
        },
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '需要正確的電話號碼'
        },
        createOrder(){
            if( this.cart === ''){
                alert("請加入購買品項!");
            }else{
                alert('送出成功!');
                this.cart = '';
            }
            
        }

    },
    components:{
        productModal
    },
    
    mounted(){
        this.getProduct();
        this.getCart();
       
    }
});


app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);


app.mount('#app');