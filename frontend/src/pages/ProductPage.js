import { parseRequestUrl } from "../utils"
import { getProduct, createReview } from "../api"
import Rating from "../components/Rating"
import { showLoading, hideLoading } from "../utils"

import { getUserInfo } from "../localStorage"

const ProductPage = {
    after_render:()=>{
        const request = parseRequestUrl()
        document.getElementById('add-button').addEventListener('click',()=>{
            document.location.hash = `/cart/${request.id}`
        })

        if (document.getElementById('review-form')) {
            document
              .getElementById('review-form')
              .addEventListener('submit', async (e) => {
                e.preventDefault();
                showLoading();
                const data = await createReview(request.id, {
                  comment: document.getElementById('comment').value,
                  rating: document.getElementById('rating').value,
                });
                hideLoading();
                if (data.error) {
                  showMessage(data.error);
                } else {
                  showMessage('Review Added Successfully', () => {
                    rerender(ProductScreen);
                  });
                }
              });
          }

        //   document.getElementById('signin').addEventListener('click',()=>{
        //     document.location.hash='/signin'
        //     setReview({addReview:true, productId:request.id})
        //   })
    },
    render:async ()=>{
        const request = parseRequestUrl()
        // console.log('request.id', request.id);
        showLoading()
        const product = await getProduct(request.id);
      
        if(product.error){
            return `<div>${product.error}</div>`
        }
        hideLoading()
        const userInfo = getUserInfo();
       
        if(product){
            console.log(product.reviews, userInfo._id);
            const reviewFromUser = product.reviews.find(review=>review.user === userInfo._id)
            console.log(reviewFromUser)
            return `
            <div class='content'>
                <div class='back-to-result'>
                    <a href="/#/">Back to Shop</a>
                </div>
                <div class='details'>
                    <div class='details-image'>
                        <img src='${product.image}' alt='${product.name}'/>
                    </div>
                    <div class='details-info'>
                        <ul>
                            <li><h1>${product.name} </h1></li>
                            <li>${Rating.render({value:product.rating,
                            text:`${product.numReviews} reviews`})}</li>
                            <li>Price: <strong>${product.price} E</strong></li>
                            <li>Description: <div>${product.longDescription}</div></li>
                        </ul>
                    </div>

                    <div class='details-action'>
                        <ul>
                        <li>Price: <strong>${product.price} E</strong></li>
                        <li>Status:
                        ${product.countInStock > 0 ? `<span class='success'>In Stock</span>`:`<span class='error'>Unavailable </span>` } </li>
                        <li><button id='add-button' class='fw primary'>Add to Cart </button> </li>
                        </ul>
                    </div>
                   
                    </div>
                    <div class="reviews">
                        <h2>Reviews</h2>
                        ${product.reviews.length === 0 ? `<div>There is no review.</div>` : ''}  
                        <ul class="review">
                        ${product.reviews
                            .map(
                            (review) =>
                                `<li>
                                <div><b>${review.name}</b></div>
                                <div class="rating-container">
                                ${Rating.render({
                                value: review.rating,
                                })}
                                <div>
                                ${review.createdAt.substring(0, 10)}
                                </div>
                                </div>
                                <div>
                                ${review.comment}
                                </div>
                            </li>`
                            )
                            .join('\n')}

        
                            <li>
                        
                            ${   
                            (userInfo.name && !reviewFromUser)
                                ? `
                                <div class="form-container">
                                <form id="review-form">
                                <ul class="form-items">
                                <li> <h3>Write a customer reviews</h3></li>
                                    <li>
                                    <label for="rating">Rating</label>
                                    <select required name="rating" id="rating">
                                        <option value="">Select</option>
                                        <option value="1">1 = Poor</option>
                                        <option value="2">2 = Fair</option>
                                        <option value="3">3 = Good</option>
                                        <option value="4">4 = Very Good</option>
                                        <option value="5">5 = Excellent</option>
                                    </select>
                                    </li>
                                    <li>
                                    <label for="comment">Comment</label>
                                    <textarea required  name="comment" id="comment" ></textarea>
                                    </li>
                                    <li>
                                    <button type="submit" class="primary">Submit</button>
                                    </li>
                                </ul>
                                </form>
                                </div>`
                           : 
                                // !userInfo.name ? ` <div>
                                // Please <a href="/#/signin">Signin</a> to write a review.` 
                                // :
                                 ''
                                }
                            </li>
                            </ul> 
                            </div>
                </div>     
            `
        }
       
    }
}

export default ProductPage